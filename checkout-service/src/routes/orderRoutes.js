const express = require('express');
const { getAllOrders, getOrderByOrderId, updateOrderStatus } = require('../controllers/orderController');
const router = express.Router();


router.get('/', getAllOrders );
// router.get('/:id', getOrderItemsByUserId );
router.get('/getOrderByOrderId', getOrderByOrderId );
router.put('/updateOrderStatus', updateOrderStatus );

module.exports = router;