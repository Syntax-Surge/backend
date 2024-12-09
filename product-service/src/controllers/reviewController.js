const asyncHandler = require('express-async-handler');
const { Review, Product } = require('../config/db');
const { getUserById } = require('../grpc/userClient');
const { Op } = require('sequelize');

const getReviews = asyncHandler(async (req, res) => {
  const page = req.query.page || 1;
  const limit = 8;
  console.log('get review', page, limit);
  let offset = limit * (page - 1);
  try {
    console.log('1');

    const reviews = await Review.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: Product }],
    });
    console.log('2');
    //Fetch the user details for each review
    const reviewsWithUserDetails = await Promise.all(
      reviews.rows.map(async (review) => {
        const user = await getUserById(review.userId);
        return { ...review.toJSON(), user };
      })
    );
    console.log('3');

    res.status(200).json({
      count: reviews.count,
      rows: reviewsWithUserDetails,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Can't get Reviews");
  }
});

// get two reviews and avg rate
const getTwoReviews = asyncHandler(async (req, res) => {
  console.log(req.headers.id);

  const id = req.headers.id;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const reviews = await Review.findAll({
      where: {
        productId: id,
      },
    });

    // filter two reviews
    // Sort reviews by rating in descending order
    const sortedReviews = reviews.sort((a, b) => b.rating - a.rating);

    // Get the top two reviews
    const topTwoReviews = sortedReviews.slice(0, 2);

    // Calculate average rating
    const totalRatings = reviews.length;
    const sumOfRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      totalRatings > 0 ? (sumOfRatings / totalRatings).toFixed(1) : 0;

    res.status(200).json({
      avgRating: averageRating,
      topTwoReviews: topTwoReviews,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Can't get Reviews");
  }
});

const createReview = asyncHandler(async (req, res) => {
  console.log('Create Review');
  const { userId, productId, rating, description } = req.body;

  if (!userId || !productId || !rating) {
    res.status(400).send({ message: 'Missing required fields!' });
    return;
  }

  try {
    const review = {
      userId,
      productId,
      rating,
      description,
    };

    const data = await Review.create(review);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating reviews:', error);
    res.status(500);
    throw new Error(
      error.message || 'Some error occurred while creating the Review.'
    );
  }
});

const getReviewsForUser = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const productId = req.query.productId;
  // const page = req.query.page || 1;
  // const limit = 8;
  // console.log("get review",page,limit);
  // let offset = limit * (page - 1)
  try {
    const reviews = await Review.findOne({
      // limit: limit,
      // offset: offset,
      where: {
        [Op.and]: [{ userId: userId }, { productId: productId }],
      },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Can't get Reviews");
  }
});

module.exports = { getReviews, createReview, getReviewsForUser, getTwoReviews };
