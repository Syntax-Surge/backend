const express=require('express');
const { createPaymentIntent,confirmPayment } = require('../controllers/payment');
const router=express.Router()

router.post('/createIntent', createPaymentIntent);
router.post('/confirmPayment', confirmPayment);

module.exports = router;