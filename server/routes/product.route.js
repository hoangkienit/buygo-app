const express = require('express');

const { verifyMiddleware, verifyAdminMiddleware } = require('../middlewares/verify.middleware');
const ProductController = require('../controllers/product.controller');
const UploadMiddleware = require('../middlewares/upload.middleware');

const router = express.Router();

// Client
router.get('/all-products', ProductController.getAllProducts);


// Admin
router.get('/admin/get-product/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.getProductForAdmin);

router.post('/admin/add-product', verifyMiddleware, verifyAdminMiddleware, UploadMiddleware.upload.single("product_img"), ProductController.addNewProduct);

router.post('/admin/delete-product/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.deleteProductForAdmin);

router.post('/admin/delete-product/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.deleteProductForAdmin);

module.exports = router;