const asyncHandler = require("express-async-handler")
const {User} = require("../config/db");

const getAllUsers = asyncHandler(async (req, res) => {
        const page = req.query.page;
        const limit = 8;
        console.log("get all users",page,limit);
        let offset = limit * (page - 1)
        try {
            const users = await User.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]            
            })
            res.status(200).json(users);
        } catch (error) {
            res.status(400);
            throw new Error(error.message || "Can't get all users");
        }
    });

module.exports = {getAllUsers};