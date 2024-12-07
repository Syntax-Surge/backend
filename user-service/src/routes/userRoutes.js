const express = require("express");
const router = express.Router();
const { getAllUsers, createError, getUserByID, getAll, updateUser, updateShippingAddress, getUserOrder, getAddressByID, createShippingAddress, updateUserProfile } = require("../controllers/userController");
const apiErrorHandler = require("../middlewares/apiErrorHandler");
const { uploadProfileImage, upload } = require("../controllers/fileUpload/uploadProfileImages");

// router.get('/' , getAllUsers)
router.get('/getAllUsers' , getAllUsers);   //admin auth
// router.get('/createError', createError);
router.get('/getUserByID' , getUserByID);  //user
router.get('/getAll', getAll);  //admin auth
router.post('/updateUser', updateUser);  //user
router.put('/updateshipping', updateShippingAddress);  //user
router.post('/createAddress', createShippingAddress); //user
// router.put('/updatebilling', updateBillingAddress);
router.get('/getOrders', getUserOrder); 
router.get('/getAddressById', getAddressByID); //admin auth //user auth


// router.post('/uploadProfileImage', uploadProfileImage);
router.post('/uploadProfileImage', upload.single('image'), uploadProfileImage);
router.post('/updateUserProfile', updateUserProfile);


router.use(apiErrorHandler);
// router.get('/deleteAccount' , getAllUsers)   delete 

module.exports = router;