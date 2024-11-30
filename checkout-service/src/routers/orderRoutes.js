const express = require('express');
const { getAllOrders, getOrderItemsByUserId } = require('../controllers/orderController');
const router = express.Router();


router.get('/', getAllOrders );
router.get('/:id', getOrderItemsByUserId );

module.exports = router;