const ProductService = require("../services/product.service");
const ReviewService = require('./../services/review.service');

const { validateProduct, validateProductAttributes, validateId, validateProductUpdate, validateProductSlug } = require("../utils/validation");
const logger = require("../utils/logger");

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

    static async getProductBySlug(req, res) {
        const { product_slug } = req.params;

        const errors = validateProductSlug({ product_slug });
        if (errors && errors.length > 0) {
            logger.error("Invalid product slug");
            return res.status(400).json({
                success: false,
                message: "Invalid product slug"
            })
        }

        try {
            const response = await ProductService.getProductBySlug(product_slug);

            const ratingResponse = await ReviewService.getProductReviewsWithStats(response.product.productId);
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
            logger.error(error);
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

        console.log(req.body);  // Check other form data
        console.log(req.files);
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'At least one image is required!' });
        }

        if (req.files.length > 5) {
            return res.status(400).json({ message: "You can upload a maximum of 5 images!" });
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
                req.files,
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

    static async deleteProductForAdmin(req, res) {
            const { productId } = req.params;
    
            const errors = validateId(productId);
            if (errors && errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: errors[0].message
                });
            }
    
            try {
                const response = await ProductService.deleteProductForAdmin(productId);
                
                return res.status(200).json({
                    success: true,
                    message: response.message
                })
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                })
            }
    }

    static async updateAccountProductForAdmin(req, res) {
        const { productId } = req.params;
        const { productName, productDescription, productStatus, productPrice } = req.body;

        let errors = validateProductUpdate({ productName, productDescription, productStatus });
        if (errors && errors.length > 0) {
            return res.status(400).json({
                    success: false,
                    message: errors[0].message
                });
        }

        errors = validateId(productId);
        if (errors && errors.length > 0) {
            return res.status(400).json({
                    success: false,
                    message: errors[0].message
                });
        }

        if (isNaN(productPrice) || productPrice < 0) {
            return res.status(400).json({
                    success: false,
                    message: "Invalid price"
                });
        }

        try {
            const response = await ProductService.updateAccountProductForAdmin(
                productId,
                productName,
                productDescription,
                productStatus,
                productPrice
            );

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    updatedProduct: response.product
                }
            })
        } catch (error) {
            return res.status(400).json({
                    success: false,
                    message: error.message
            })
        }
    }

    static async updateTopUpProductForAdmin(req, res) {
        const { productId } = req.params;
        const { productName, productDescription, productStatus } = req.body;

        let errors = validateProductUpdate({ productName, productDescription, productStatus });
        if (errors && errors.length > 0) {
            return res.status(400).json({
                    success: false,
                    message: errors[0].message
                });
        }

        errors = validateId(productId);
        if (errors && errors.length > 0) {
            return res.status(400).json({
                    success: false,
                    message: errors[0].message
                });
        }

        try {
            const response = await ProductService.updateTopUpProductForAdmin(
                productId,
                productName,
                productDescription,
                productStatus
            );

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    updatedProduct: response.product
                }
            })
        } catch (error) {
            return res.status(400).json({
                    success: false,
                    message: error.message
            })
        }
    }

    static async addAccountToProductForAdmin(req, res) {
        const { productId } = req.params;
        const { product_attributes_data } = req.body;

        let errors = validateId(productId);
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        const product_type = "game_account";
        const productAttributes = product_attributes_data;

        errors = validateProductAttributes({ product_type, productAttributes });
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        try {
            const response = await ProductService.addAccountToProductForAdmin(
                productId,
                product_attributes_data
            );

            console.log(response.accounts)

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    updatedAccounts: response.accounts
                }
            })
        } catch (error) {
            return res.status(400).json({
                    success: false,
                    message: error.message
            })
        }
    }

    static async addPackageToProductForAdmin(req, res) {
        const { productId } = req.params;
        const { product_attributes_data } = req.body;

        let errors = validateId(productId);
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        const product_type = "topup_package";
        const productAttributes = product_attributes_data;

        errors = validateProductAttributes({ product_type, productAttributes });
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        try {
            const response = await ProductService.addPackageToProductForAdmin(
                productId,
                product_attributes_data
            );

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    updatedPackages: response.packages
                }
            })
        } catch (error) {
            return res.status(400).json({
                    success: false,
                    message: error.message
            })
        }
    }

    static async deleteAccountFromProductForAdmin(req, res) {
        const { productId, accountId } = req.params;

        let errors = validateId(productId);
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        errors = validateId(accountId);
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        try {
            const response = await ProductService.deleteAccountFromProductForAdmin(
                productId,
                accountId
            );

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    updatedAccounts: response.accounts
                }
            })
        } catch (error) {
            return res.status(400).json({
                    success: false,
                    message: error.message
            })
        }
    }

    static async deletePackageFromProductForAdmin(req, res) {
        const { productId, packageId } = req.params;

        let errors = validateId(productId);
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        errors = validateId(packageId);
        if (errors && errors.length > 0) {
            return res.status(400).json({ success: false, error: errors[0].message });
        }

        try {
            const response = await ProductService.deletePackageFromProductForAdmin(
                productId,
                packageId
            );

            return res.status(200).json({
                success: true,
                message: response.message,
                data: {
                    updatedPackages: response.packages
                }
            })
        } catch (error) {
            return res.status(400).json({
                    success: false,
                    message: error.message
            })
        }
    }
}
module.exports = ProductController;