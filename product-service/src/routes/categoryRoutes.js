const express = require("express");
const router = express.Router(); 
const {createCategory, getCategories, updateCategory, deleteCategory, getSubCategories} = require("../controllers/categoryController");
const { upload, uploadCategoryImage } = require('../controllers/fileUpload/uploadCategoryImage');
const browseByCategory = require("../controllers/browseByCategory/browseByCategory.controller");

router.get('/' , getCategories)
router.post('/' , createCategory)
router.put('/admin/:id' , updateCategory)
router.delete('/admin/:id', deleteCategory)
router.get('/subCategories' , getSubCategories)
router.post('/uploadCategoryImage', upload.single('image'), uploadCategoryImage);

router.get('/browse', browseByCategory);



module.exports = router;