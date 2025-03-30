const ProductService = require("../services/product.service");
const { validateProduct } = require("../utils/validation");

class ProductController {
    // 🔹 Get All Product
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

    static async addNewProduct(req, res) {
        const {
            product_name,
            product_description,
            product_type,
            product_category,
            product_status,
            product_stock,
            product_attributes
        } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        const errors = validateProduct({
            product_name,
            product_description,
            product_type,
            product_category,
            product_status,
            product_stock,
        });
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        //TODO: Validate this
        let productAttributes = null;
        if (product_attributes) {
            productAttributes = JSON.parse(product_attributes);
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