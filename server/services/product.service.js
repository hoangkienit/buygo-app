const { convertToObjectId } = require('../utils/convert');
const { generateProductId } = require('../utils/random');
const { slugify } = require('../utils/text');
const { Product, TopUpPackage, GameAccount } = require('./../models/product.model');
const imageService = require('./image.service');
const bcrypt = require("bcryptjs");

class ProductService {
    // 🔹 Get all products
    static async getAllProducts() {
        let products = await Product.find().lean();

        for (let product of products) {
            if (product.product_type === "game_account") {
                let gameAccount = await GameAccount.findOne({ _id: product.product_attributes }).lean();
                if (gameAccount) {
                    delete gameAccount.account.username; // Remove sensitive data
                    delete gameAccount.account.password;
                    product.product_attributes = gameAccount;
                }
            } else if (product.product_type === "topup_package") {
                let topUpPackage = await TopUpPackage.findOne({ _id: product.product_attributes }).lean();
                if (topUpPackage) {
                    product.product_attributes = topUpPackage;
                }
            }
        }
        if (!products) products = [];
        return { message: "Get products successfully", products: products };
    }

    static async addNewProduct(
        product_name,
        product_description,
        product_type,
        product_category,
        product_status,
        product_stock,
        image,
        product_price,
        product_attributes
    ) {
        // 🔹 Check if product existed
        let existingProduct = await Product.findOne({ product_name });

        if (existingProduct) {
            throw new Error("Tên sản phẩm đã tồn tại");
        }

        const imageUrl = await imageService.processAndUploadImage(image, "products", null);
            
        if (!imageUrl) {
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
                product_img: imageUrl.imageUrl,
                product_attributes: {}
        });
            
        await existingProduct.save();


        if (existingProduct.product_type === "game_account") {
            if (!Array.isArray(product_attributes)) {
                throw new Error("product_attributes must be an array");
            }

            // Hash passwords for each account entry
            const hashedAccounts = await Promise.all(
                product_attributes.map(async (attr) => {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(attr.password, salt);

                    return {
                        username: attr.username,
                        password: hashedPassword,
                        sold: false
                    };
                })
            );

            // Create new GameAccount entry
            const newGameAccount = new GameAccount({
                price: product_price || 0, // Assuming price is same for all
                account: hashedAccounts
            });

            await newGameAccount.save();

            existingProduct.product_attributes = newGameAccount;
            await existingProduct.save();
        } else {
            throw new Error("Invalid product type")
        }

        
        return {
            message: "Create product successfully",
            product: existingProduct
        }
    }

}

module.exports = ProductService;
