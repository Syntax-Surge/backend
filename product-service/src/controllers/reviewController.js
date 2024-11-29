const asyncHandler = require("express-async-handler");
const { Review, Product } = require("../config/db");
const { getUserById } = require('../grpc/userClient');

const getReviews = asyncHandler(async (req, res) => { 
    const page = req.query.page || 1;
    const limit = 8;
    console.log("get review",page,limit);
    let offset = limit * (page - 1)
    try {
        const reviews = await Review.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Product }
            ],           
        });
        //Fetch the user details for each review
        const reviewsWithUserDetails = await Promise.all(
            reviews.rows.map(async (review) => {
                const user = await getUserById(review.userId);
                return {...review.toJSON(), user };
            })
        )

        res.status(200).json({
            count: reviews.count,
            rows: reviewsWithUserDetails,
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't get Reviews");
    }
});

const createReview = asyncHandler(async (req, res) => {
    console.log("Create Review");
    const { userId, productId, rating, description } = req.body;

    if (!userId || !productId || !rating ) {
        res.status(400).send({ message: "Missing required fields!" });
        return;
    }

    try {
        const review = {
            userId,
            productId,
            rating,
            description
        };

        const data = await Review.create(review);
        res.status(201).json(data);
    } catch (error) {
        console.error("Error creating reviews:", error);
        res.status(500);
        throw new Error(error.message || "Some error occurred while creating the Review.");
    }
});



module.exports = { getReviews, createReview };
