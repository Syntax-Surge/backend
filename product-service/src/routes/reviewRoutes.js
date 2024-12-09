const express = require("express");
const router = express.Router(); 
const { getReviews, createReview, getReviewsForUser } = require("../controllers/reviewController");

router.get('/' , getReviews);
router.post('/' , createReview);
router.get('/getReviewsForUser' , getReviewsForUser);

module.exports = router;