const express = require("express");
const router = express.Router();
const { getAllUsers, createError, getUserByID, getAll, updateUser, updateShippingAddress, getUserOrder, getAddressByID, createShippingAddress, getAllUserOrderItems, updateUserProfile } = require("../controllers/userController");
const apiErrorHandler = require("../middlewares/apiErrorHandler");
// const { checkAuthentication } = require("../middlewares/auth");
const { uploadProfileImage, upload } = require("../controllers/fileUpload/uploadProfileImages");

// router.get('/' , getAllUsers)
router.get('/' , getAllUsers);
// router.get('/createError', createError);
router.get('/getUserByID' , getUserByID);
router.get('/getAll', getAll);
router.post('/updateUser', updateUser);
router.put('/updateshipping', updateShippingAddress);
router.post('/createAddress',createShippingAddress);
router.get('/getOrders', getUserOrder);
router.get('/getAllUserOrderItems', getAllUserOrderItems); 
router.get('/getAddressById', getAddressByID); //admin auth //user auth


// router.post('/uploadProfileImage', uploadProfileImage);
router.post('/uploadProfileImage', upload.single('image'), uploadProfileImage);
router.post('/updateUserProfile', updateUserProfile);


router.use(apiErrorHandler);
// router.get('/deleteAccount' , getAllUsers)   delete 

module.exports = router;