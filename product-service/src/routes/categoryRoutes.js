const express = require("express");
const router = express.Router(); 
const {createCategory, getCategories, updateCategory, deleteCategory, getSubCategories} = require("../controllers/categoryController");
const { upload, uploadCategoryImage } = require('../controllers/fileUpload/uploadCategoryImage');

router.get('/' , getCategories)
router.post('/' , createCategory)
router.put('/:id' , updateCategory)
router.delete('/:id', deleteCategory)
router.get('/subCategories' , getSubCategories)
router.post('/uploadCategoryImage', upload.single('image'), uploadCategoryImage);

module.exports = router;