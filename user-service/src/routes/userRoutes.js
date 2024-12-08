const express = require("express");
const router = express.Router();
const { getAllUsers, createError, getUserByID, getAll, updateUser, updateShippingAddress, getUserOrder, getAddressByID, createShippingAddress } = require("../controllers/userController");
const apiErrorHandler = require("../middlewares/apiErrorHandler");
const { checkAuthentication } = require("../middlewares/auth");

// router.get('/' , getAllUsers)
router.get('/getAllUsers' , checkAuthentication, getAllUsers);
// router.get('/createError', createError);
router.get('/getUserByID' ,checkAuthentication, getUserByID);
router.get('/getAll', getAll);
router.post('/updateUser',checkAuthentication, updateUser);
router.put('/updateshipping',checkAuthentication, updateShippingAddress);
router.post('/createAddress',checkAuthentication,createShippingAddress);
// router.put('/updatebilling', updateBillingAddress);
router.get('/getOrders',checkAuthentication, getUserOrder); 
router.get('/getAddressById',checkAuthentication, getAddressByID); 


router.use(apiErrorHandler);
// router.get('/deleteAccount' , getAllUsers)   delete 

module.exports = router;