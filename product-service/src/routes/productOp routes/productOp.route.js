const express = require('express');
const search = require('../../controllers/search/search.controller');
const filter = require('../../controllers/filter/filter.controller');
const {getProducts, createProduct, updateProduct, deleteProduct} = require("../../controllers/productController");
const { upload, uploadProductImage } = require('../../controllers/fileUpload/uploadProductImages')

const router = express.Router();

router.get('/search',search);
router.get('/filter',filter);
router.get('/' , getProducts)
router.post('/' , createProduct)
router.put('/:id' , updateProduct);
router.delete('/:id', deleteProduct);
router.post('/uploadProductImage', upload.single('image'), uploadProductImage);

module.exports = router;