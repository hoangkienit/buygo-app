const { convertToObjectId } = require('../utils/convert');
const { generateProductId } = require('../utils/random');
const { slugify } = require('../utils/text');
const { Product, TopUpPackage, GameAccount } = require('./../models/product.model');
const imageService = require('./image.service');
const CryptoJS = require("crypto-js");

class ProductService {
    // 🔹 Get all products
    static async getAllProducts() {
        let products = await Product.find().lean();

        for (let product of products) {
        if (product.product_type === "game_account" && product.product_attributes?.account) {
            // 🔹 Mask account details
            product.product_attributes.account = product.product_attributes.account.map(acc => ({
                ...acc,
                username: undefined,
                password: undefined
            }));
            }
            // 🔹 No need to modify "topup_package" since it doesn't have sensitive data
        }

        if (!products) products = [];
        return { message: "Get products successfully", products: products };
    }

    // 🔹 Get product for admin
    static async getProductForAdmin(productId) {
        const product = await Product.findOne({productId}).lean();
        if (!product) throw new Error("No product found");
        
        if (product.product_type === 'game_account') {
            product.product_attributes.account = product.product_attributes.account.map((acc) => ({
                username: acc.username,
                password: decryptPassword(acc.password), // Show decrypted password
                sold: acc.sold
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

            const encryptedAccounts = product_attributes.map((attr) => {
                const encryptedPassword = CryptoJS.AES.encrypt(attr.password, process.env.CRYPTO_SECRET).toString();

                return {
                    username: attr.username,
                    password: encryptedPassword,
                    sold: false
                    };
                });

            // Create new GameAccount entry
            const newGameAccount = new GameAccount({
                price: product_price || 0, // Assuming price is same for all
                account: encryptedAccounts
            });

            await newGameAccount.save();

            existingProduct.product_attributes = newGameAccount;
            await existingProduct.save();
        } else if (existingProduct.product_type === "topup_package") {
            if (!Array.isArray(product_attributes)) {
                throw new Error("product_attributes must be an array");
            }

            const newTopUpPackage = new TopUpPackage({
                packages: product_attributes
            });

            await newTopUpPackage.save();

            existingProduct.product_attributes = newTopUpPackage;
            await existingProduct.save();
        }
        
        else {
            throw new Error("Invalid product type")
        }

        
        return {
            message: "Create product successfully",
            product: existingProduct
        }
    }
    
    static async deleteProductForAdmin(productId) {
        const product = await Product.deleteOne({ productId });

        if (product.deletedCount === 0) {
            throw new Error("Product not found");
        }
        
        return {
            message: "Delete product successfully"
        }
    }
}

const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, process.env.CRYPTO_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = ProductService;
