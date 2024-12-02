const express = require("express");
const router = express.Router();
const { getAllUsers, createError, getUserByID, getAll, updateUser, updateShippingAddress, getUserOrder, getAddressByID, createShippingAddress } = require("../controllers/userController");
const apiErrorHandler = require("../middlewares/apiErrorHandler");

router.get('/' , getAllUsers)
// router.get('/createError', createError);
router.get('/getUserByID' , getUserByID);
router.get('/getAll', getAll);
router.post('/updateUser', updateUser);
router.put('/updateshipping', updateShippingAddress);
router.post('/createAddress', createShippingAddress);
router.get('/getOrders', getUserOrder); 
router.get('/getAddressById', getAddressByID); 


router.use(apiErrorHandler);
// router.get('/deleteAccount' , getAllUsers)   delete 

module.exports = router;