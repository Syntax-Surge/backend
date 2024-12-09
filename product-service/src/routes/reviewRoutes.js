const express = require("express");
const router = express.Router(); 
const { getReviews, createReview, getReviewsForUser, updateReview } = require("../controllers/reviewController");

router.get('/' , getReviews);
router.post('/' , createReview);
router.put('/', updateReview);
router.get('/getReviewsForUser' , getReviewsForUser);

module.exports = router;