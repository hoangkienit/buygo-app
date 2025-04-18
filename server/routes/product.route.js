const express = require('express');

const { verifyMiddleware, verifyAdminMiddleware } = require('../middlewares/verify.middleware');
const ProductController = require('../controllers/product.controller');
const UploadMiddleware = require('../middlewares/upload.middleware');

const router = express.Router();

// Client
router.get('/all-products', ProductController.getAllProducts);

router.get('/get-product/:product_slug', ProductController.getProductBySlug);

router.get('/products', ProductController.getProductsByType);


// Admin
router.get('/admin/get-product/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.getProductForAdmin);

router.post('/admin/add-product', verifyMiddleware, verifyAdminMiddleware, UploadMiddleware.upload.array("product_img", 5), ProductController.addNewProduct);

router.delete('/admin/delete-product/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.deleteProductForAdmin);

router.patch('/admin/update-product/account/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.updateAccountProductForAdmin);

router.patch('/admin/update-product/topup/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.updateTopUpProductForAdmin);

router.patch('/admin/update-product/add-account/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.addAccountToProductForAdmin);

router.patch('/admin/update-product/add-package/:productId', verifyMiddleware, verifyAdminMiddleware, ProductController.addPackageToProductForAdmin);

router.patch('/admin/update-product/delete-account/:productId/:accountId', verifyMiddleware, verifyAdminMiddleware, ProductController.deleteAccountFromProductForAdmin);

router.patch('/admin/update-product/delete-package/:productId/:packageId', verifyMiddleware, verifyAdminMiddleware, ProductController.deletePackageFromProductForAdmin);

module.exports = router;