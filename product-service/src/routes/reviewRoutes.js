const express = require('express');
const router = express.Router();
const {
  getReviews,
  createReview,
  getReviewsForUser,
  getTwoReviews,
} = require('../controllers/reviewController');

router.get('/', getReviews);
router.get('/two', getTwoReviews);
router.post('/', createReview);
router.get('/getReviewsForUser', getReviewsForUser);

module.exports = router;
