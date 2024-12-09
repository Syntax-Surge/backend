const express = require('express');
const search = require('../../controllers/search/search.controller');
const filter = require('../../controllers/filter/filter.controller');
const {getProducts, createProduct, updateProduct, deleteProduct,getProduct} = require("../../controllers/productController");
const { upload, uploadProductImage } = require('../../controllers/fileUpload/uploadProductImages');
const browseByCategory = require('../../controllers/browseByCategory/browseByCategory.controller');

const router = express.Router();

router.get('/search',search);
router.get('/filter',filter);
router.get('/' , getProducts);
router.get('/:id' , getProduct);
router.post('/admin' , createProduct);
router.put('/admin/:id' , updateProduct);
router.delete('/admin/:id', deleteProduct);
// tempory
// router.delete('/:id', getReview);
router.post('/uploadProductImage', upload.single('image'), uploadProductImage);

module.exports = router;