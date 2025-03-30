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
            // 🔒 Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(product_attributes?.password, salt);
            
            var newGameAccount = new GameAccount({
                account: {
                    username: product_attributes?.username,
                    password: hashedPassword,
                    price: product_attributes?.price,
                    sold: false
                }
            });

            await newGameAccount.save();
        } else {
            throw new Error("Invalid product type")
        }

        if (newGameAccount) {
            existingProduct.product_attributes = newGameAccount;
            await existingProduct.save();
        }
        
        return {
            message: "Create product successfully",
            product: existingProduct
        }
    }

}

module.exports = ProductService;
