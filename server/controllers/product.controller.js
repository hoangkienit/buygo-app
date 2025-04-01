const ProductService = require("../services/product.service");
const ReviewService = require('./../services/review.service');

const { validateProduct, validateProductAttributes, validateId } = require("../utils/validation");

class ProductController {
    // 🔹 Get All Product For Client
    static async getAllProducts(req, res) {
        try {
            const response = await ProductService.getAllProducts();
            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    products: response.products
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    // 🔹 Get Product For Admin
    static async getProductForAdmin(req, res) {
        const { productId } = req.params;
        
        const errors = validateId(productId);
        if (errors && errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors[0].message
            });
        }

        try {
            const response = await ProductService.getProductForAdmin(productId);

            const ratingResponse = await ReviewService.getProductReviewsWithStats(productId);

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    product: {
                        ...response.product,
                        ...ratingResponse
                    }
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    static async addNewProduct(req, res) {
        const {
            product_name,
            product_description,
            product_type,
            product_category,
            product_status,
            product_stock,
            product_price,
            product_attributes
        } = req.body;
        console.log(product_price)
        console.log(JSON.parse(product_attributes));

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        let errors = validateProduct({
            product_name,
            product_description,
            product_type,
            product_category,
            product_status,
            product_stock,
            product_price
        });
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        
        // Validate product attributes
        let productAttributes = null;
        if (product_attributes) {
            productAttributes = JSON.parse(product_attributes);
        }
        console.log(productAttributes);

        errors = validateProductAttributes({ product_type, productAttributes });
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        try {
            const response = await ProductService.addNewProduct(
                product_name,
                product_description,
                product_type,
                product_category,
                product_status,
                product_stock,
                req.file,
                product_price,
                productAttributes
            );

            if (response) {
                return res.status(201).json({
                    success: true,
                    message: response.message,
                    data: {
                        product: response.product
                    }
                })
            }
        }
        catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
module.exports = ProductController;