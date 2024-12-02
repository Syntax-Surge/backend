const express = require("express");
const router = express.Router(); 
const { getReviews, createReview,getTwoReviews } = require("../controllers/reviewController");

router.get('/' , getReviews)
router.get('/two' , getTwoReviews)
router.post('/' , createReview)

module.exports = router;