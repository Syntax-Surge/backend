const express = require("express");
const router = express.Router();
const { getAllUsers, createError } = require("../controllers/userController");
const apiErrorHandler = require("../middlewares/apiErrorHandler");

// router.get('/' , getAllUsers)
router.get('/getAllUsers' , getAllUsers);
// router.get('/createError', createError);


router.use(apiErrorHandler);
// router.get('/deleteAccount' , getAllUsers)   delete 

module.exports = router;