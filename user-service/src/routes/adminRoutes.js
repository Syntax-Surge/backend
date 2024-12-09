const express = require("express");
const router = express.Router();
const { getAllUsers, createError, getUserByID, getAll, updateUser, updateShippingAddress, getUserOrder, getAddressByID, createShippingAddress, getAllUserOrderItems } = require("../controllers/userController");
const apiErrorHandler = require("../middlewares/apiErrorHandler");
// const { checkAuthentication } = require("../middlewares/auth");

// router.get('/' , getAllUsers)
router.get('/' , getAllUsers);
// router.get('/createError', createError);
router.get('/getUserByID' , getUserByID);
router.get('/getOrders', getUserOrder);
router.get('/getAllUserOrderItems', getAllUserOrderItems); 
router.get('/getAddressById', getAddressByID); 


router.use(apiErrorHandler);
// router.get('/deleteAccount' , getAllUsers)   delete 

module.exports = router;