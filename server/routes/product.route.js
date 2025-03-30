const express = require('express');

const { verifyMiddleware, verifyAdminMiddleware } = require('../middlewares/verify.middleware');
const ProductController = require('../controllers/product.controller');
const UploadMiddleware = require('../middlewares/upload.middleware');

const router = express.Router();


router.get('/all-products', ProductController.getAllProducts);

router.post('/add-product', verifyMiddleware, verifyAdminMiddleware, UploadMiddleware.upload.single("product_img"), ProductController.addNewProduct);



module.exports = router;