const { convertToObjectId } = require("../utils/convert");
const mongoose = require("mongoose");
const { generateProductId } = require("../utils/random");
const { slugify } = require("../utils/text");
const {
  Product,
  TopUpPackage,
  GameAccount,
} = require("./../models/product.model");
const imageService = require("./image.service");
const logger = require("../utils/logger");
const ReviewService = require("./review.service");
const { encrypt, decrypt } = require("../utils/crypto");
const Review = require("../models/review.model");

class ProductService {
  // 🔹 Get all products
  static async getAllProducts(limit = 50) {
    let products = await Product.find().limit(limit).lean();

    for (let product of products) {
      if (
        product.product_type === "utility_account" &&
        product.product_attributes?.account
      ) {
        // 🔹 Mask account details
        product.product_attributes.account =
          product.product_attributes.account.map((acc) => ({
            ...acc,
            username: undefined,
            password: undefined,
          }));
      }
      
    
    }

    if (!products) products = [];
    return { message: "Get products successfully", products: products };
  }

  static async getProductBySlug(product_slug) {
    let product = await Product.findOne({ product_slug }).lean();

    if (!product) throw new Error("Product not found");
    return { message: "Get product successfully", product: product };
  }

  static async getProductsByType(type, limit) {
    const products = await Product.find({ product_type: type })
      .limit(Number(limit))
      .sort({ createAt: -1 })
      .lean();

    if (!products) {
      throw new Error("Products not found");
    }

    const productsWithReviews = await Promise.all(
      products.map(async (product) => {
        const reviewStats = await ReviewService.getProductReviewsWithStats(
          product.productId
        );

        return {
          ...product,
          reviews: reviewStats.reviews,
          averageRating: reviewStats.averageRating,
          totalReviews: reviewStats.totalReviews,
        };
      })
    );

    return {
      message: "Get products success",
      products: productsWithReviews,
    };
  }

  // 🔹 Get product for admin
  static async getProductForAdmin(productId) {
    const product = await Product.findOne({ productId }).lean();
    if (!product) throw new Error("No product found");

    if (
      product.product_type === "utility_account" ||
      product.product_type === "game_account"
    ) {
      product.product_attributes.account =
        product.product_attributes.account.map((acc) => ({
          ...acc,
          password: decrypt(acc.password), // Show decrypted password
        }));
    }

    return { message: "Get products successfully", product: product };
  }

  static async addNewProduct(
    product_name,
    product_description,
    product_type,
    product_category,
    product_status,
    product_stock,
    images,
    product_price,
    product_attributes,
    isValuable
  ) {
    // 🔹 Check if product existed
    let existingProduct = await Product.findOne({ product_name });

    if (existingProduct) {
      throw new Error("Tên sản phẩm đã tồn tại");
    }

    const uploadPromises = images.map((file) =>
      imageService.processAndUploadImage(file, "product", null)
    );
    const uploadedImages = await Promise.all(uploadPromises);

    const imageUrls = uploadedImages.map((img) => img.imageUrl);

    if (!imageUrls) {
      throw new Error("Upload ảnh không thành công");
    }

    existingProduct = new Product({
      productId: generateProductId(),
      product_name: product_name,
      product_description: product_description,
      product_type: product_type,
      product_slug: slugify(product_name),
      product_category: product_category,
      product_status: product_status,
      product_stock: product_stock,
      product_imgs: imageUrls,
      isValuable: isValuable,
      product_attributes: {},
    });

    await existingProduct.save();

    if (
      existingProduct.product_type === "utility_account" ||
      existingProduct.product_type === "game_account"
    ) {
      if (!Array.isArray(product_attributes)) {
        throw new Error("product_attributes must be an array");
      }

      const encryptedAccounts = product_attributes.map((attr) => {
        const encryptedPassword = encrypt(attr.password);

        return {
          username: attr.username,
          password: encryptedPassword,
          sold: false,
        };
      });

      // Create new utility account, I use GameAccount because they have same fields
      const newGameAccount = new GameAccount({
        price: product_price || 0, // Assuming price is same for all
        account: encryptedAccounts,
      });

      existingProduct.product_attributes = newGameAccount;
      await existingProduct.save();
    } else if (existingProduct.product_type === "topup_package") {
      if (!Array.isArray(product_attributes)) {
        throw new Error("product_attributes must be an array");
      }

      const newTopUpPackage = new TopUpPackage({
        packages: product_attributes,
      });

      existingProduct.product_attributes = newTopUpPackage;
      await existingProduct.save();
    } else {
      throw new Error("Invalid product type");
    }

    return {
      message: "Create product successfully",
      product: existingProduct,
    };
  }

  static async deleteProductForAdmin(productId) {
    const product = await Product.findOne({ productId });

    if (!product) {
      throw new Error("Product not found");
    }

    const imageUrls = product.product_imgs;

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("No images to delete for this product");
    }

    for (const imageUrl of imageUrls) {
      try {
        const deleteResult = await imageService.deleteFromCloudinary(imageUrl);
        if (deleteResult.success) {
          console.log(`Image deleted: ${imageUrl}`);
        }
      } catch (error) {
        logger.error(`Failed to delete image ${imageUrl}: ${error.message}`);
      }
    }

    const result = await Product.deleteOne({ productId });

    if (result.deletedCount === 0) {
      throw new Error("Failed to delete product");
    }

    return {
      message: "Delete product successfully",
    };
  }

  static async updateAccountProductForAdmin(
    productId,
    productName,
    productDescription,
    productStatus,
    productPrice,
    productStock
  ) {
    const product = await Product.findOne({ productId });

    if (!product) {
      throw new Error("Product not found");
    }

    product.product_name = productName;
    product.product_slug = slugify(productName);
    product.product_description = productDescription;
    product.product_status = productStatus;
    product.product_stock = productStock;

    product.product_attributes = {
      ...product.product_attributes,
      price: productPrice,
    };

    await product.save();
    return {
      message: "Update product successfully",
      product: product,
    };
  }

  static async updateTopUpProductForAdmin(
    productId,
    productName,
    productDescription,
    productStatus
  ) {
    const product = await Product.findOne({ productId });

    if (!product) {
      throw new Error("Product not found");
    }

    product.product_name = productName;
    product.product_slug = slugify(productName);
    product.product_description = productDescription;
    product.product_status = productStatus;

    await product.save();
    return {
      message: "Update product successfully",
      product: product,
    };
  }

  static async addAccountToProductForAdmin(productId, product_attributes_data) {
    const product = await Product.findOneAndUpdate(
      { productId },
      {
        $push: {
          "product_attributes.account": {
            $each: product_attributes_data.map((acc) => ({
              ...acc,
              password: encrypt(acc.password),
              _id: new mongoose.Types.ObjectId(),
              sold: false,
            })),
          },
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      message: "Add account to product successfully",
      accounts: product.product_attributes.account.map((acc) => ({
        ...acc,
        password: decrypt(acc.password),
      })),
    };
  }

  static async addPackageToProductForAdmin(productId, product_attributes_data) {
    const product = await Product.findOneAndUpdate(
      { productId },
      {
        $push: {
          "product_attributes.packages": {
            $each: product_attributes_data.map((pack) => ({
              ...pack,
              status: "available",
              _id: new mongoose.Types.ObjectId(),
              sold: false,
            })),
          },
        },
      },
      { new: true, useFindAndModify: false }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      message: "Add package to product successfully",
      packages: product.product_attributes.packages,
    };
  }

  static async deleteAccountFromProductForAdmin(productId, accountId) {
    const product = await Product.findOneAndUpdate(
      { productId },
      {
        $pull: {
          "product_attributes.account": { _id: convertToObjectId(accountId) },
        },
      },
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      message: "Delete account from product successfully",
      accounts: product.product_attributes.account.map((acc) => ({
        ...acc,
        password: decrypt(acc.password),
      })),
    };
  }

  static async deletePackageFromProductForAdmin(productId, packageId) {
    const product = await Product.findOneAndUpdate(
      { productId },
      {
        $pull: {
          "product_attributes.packages": { _id: convertToObjectId(packageId) },
        },
      },
      { new: true }
    );

    if (!product) {
      throw new Error("Product not found");
    }

    return {
      message: "Delete package from product successfully",
      packages: product.product_attributes.packages,
    };
  }
}

module.exports = ProductService;
