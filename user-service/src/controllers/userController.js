const asyncHandler = require("express-async-handler")
// const { User } = require("../config/db");
const db  = require("../config/db")
const { where } = require("sequelize");
const {getOrderItemsById, getAllOrderItems} = require("../grpc/orderClient")

const User=db.users;
const Address=db.Address;
// const OrderItems = db.orderItems

const getAllUsers = asyncHandler(async (req, res) => {
    const page = req.query.page;
    const limit = 8;
    console.log("get all users", page, limit);
    let offset = limit * (page - 1)
    try {
        const users = await User.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'firstName', 'lastName','email', 'contactNo', 'profileImage'],
        })
        res.status(200).json(users);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't get all users");
    }
});




const getAll = asyncHandler(async (req, res) => {

    try {
        const users = await User.findAll({
            attributes: ['firstName', 'lastName'],
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't get all users");
    }
});

const getUserByID = asyncHandler(async (req, res) => { 

    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    console.log(user,"user");
    const id = user.id;


    // const id = req.query.id;


    try {
        const user = await User.findByPk(id)
        res.status(200).json(user);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't get user");
    }
});

const updateUser = asyncHandler(async (req, res) => {


    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    console.log(user,"user");
    const id = user.id;


    const data = req.body;
    // const id = req.query.id;
    console.log(data);
    console.log(id);
    let updateFields = {};
    if (data.updateFirstName) updateFields.firstName = data.updateFirstName;
    if (data.updateLastName) updateFields.lastName = data.updateLastName;
    if (data.updateEmail) updateFields.email = data.updateEmail;
    if (data.updateNewPassword) updateFields.password = data.updateNewPassword;
    if (data.contactNo) updateFields.contactNo = data.contactNo;
    if (data.profileImage) updateFields.profileImage = data.profileImage;
    try {
        const updateUser = await User.update(
            updateFields
            , {
                where: {
                    id: id
                }
            })
        res.status(200).json(updateUser);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Unable to update user");
    }
});



const updateUserProfile = asyncHandler(async (req, res) => {

    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    console.log(user,"user");
    const id = user.id;


    const data = req.body;
    // const id = req.query.id;
    console.log("------");
    
    console.log(data);
    console.log(id);
    const imageUrlString = data.imageUrl;
    console.log(imageUrlString);
    
    // let updateFields = {};
    // if (data.updateFirstName) updateFields.firstName = data.updateFirstName;
    // if (data.updateLastName) updateFields.lastName = data.updateLastName;
    // if (data.updateEmail) updateFields.email = data.updateEmail;
    // if (data.updateNewPassword) updateFields.password = data.updateNewPassword;
    // if (data.contactNo) updateFields.contactNo = data.contactNo;
    // if (data.profileImage) updateFields.profileImage = data.profileImage;
    try {
        const updateUserProfile = await User.update(
            {profileImage: imageUrlString}
            , {
                where: {
                    id: id
                }
            })
        res.status(200).json(updateUserProfile);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Unable to update user");
    }
});



// const createBillingAddress = asyncHandler(async (req, res) => {
//     const data = req.params.data;
//     const id = req.query.id;
//     console.log(data);
//     console.log(id);
//     let billingAddress = {};
//     if (data.line1) updateFields.billingAddressLine1 = data.line1;
//     if (data.line2) updateFields.billingAddressLine2 = data.line2;
//     if (data.city) updateFields.billingCity = data.city;
//     if (data.state) updateFields.billingState = data.state;
//     if (data.postalCode) updateFields.billingPostalCode = data.postalCode;
//     if (data.country) updateFields.billingCountry = data.country;
//     try {
//         const users = await User.create(
//             billingAddress
//             , {
//                 where: {
//                     id: id
//                 },
//             })
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message || "Can't add billing address");
//     }
// });

const createShippingAddress = asyncHandler(async (req, res) => {

    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    console.log(user,"user");
    const id = user.id;


    const data = req.body;
    // const id = req.query.id;
    console.log(data);
    console.log(id);
    let shippingAddress = {};
    console.log("createAddress");
    
    if (data.line1) shippingAddress.shippingAddressLine1 = data.line1;
    if (data.line2) shippingAddress.shippingAddressLine2 = data.line2;
    if (data.city) shippingAddress.shippingCity = data.city;
    if (data.state) shippingAddress.shippingState = data.state;
    if (data.postalCode) shippingAddress.shippingPostalCode = data.postalCode;
    if (data.country) shippingAddress.shippingCountry = data.country;
    if (id) shippingAddress.userId = id;
    try {
        const users = await Address.create(
            shippingAddress
            )
        res.status(200).json(users);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't add billing address");
    }
});


const updateBillingAddress = asyncHandler(async (req, res) => {
    const data = req.body;
    const id = req.query.id;
    console.log(data);
    console.log(id);
    let billingAddress = {};
    if (data.line1) billingAddress.billingAddressLine1 = data.line1;
    if (data.line2) billingAddress.billingAddressLine2 = data.line2;
    if (data.city) billingAddress.billingCity = data.city;
    if (data.state) billingAddress.billingState = data.state;
    if (data.postalCode) billingAddress.billingPostalCode = data.postalCode;
    if (data.country) billingAddress.billingCountry = data.country;
    try {
        const users = await User.update(
            billingAddress
            , {
                where: {
                    id: id
                },
            })
        res.status(200).json(users);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't add billing address");
    }
});


const updateShippingAddress = asyncHandler(async (req, res) => {

    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    console.log(user,"user");
    const id = user.id;


    const data = req.body;
    // const id = req.query.id;
    // console.log(data);
    // console.log(id);
    let shippingAddress = {};
    console.log("updateshipping");
    
    if (data.line1) shippingAddress.shippingAddressLine1 = data.line1;
    if (data.line2) shippingAddress.shippingAddressLine2 = data.line2;
    if (data.city) shippingAddress.shippingCity = data.city;
    if (data.state) shippingAddress.shippingState = data.state;
    if (data.postalCode) shippingAddress.shippingPostalCode = data.postalCode;
    if (data.country) shippingAddress.shippingCountry = data.country;
    if (id) shippingAddress.userId = id;
    console.log(shippingAddress);
    
    try {
        const address = await Address.update(
            shippingAddress
            , {
                where: {
                    id: id
                },
            })
        res.status(200).json(address);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't add billing address");
    }
});


// const getUserOrders = asyncHandler(async (req, res) => {
//     // const page = req.query.page;
//     // const limit = 8;
//     // console.log("get all users",page,limit);
//     // let offset = limit * (page - 1)
//     try {
//         const orders = await User.findAndCountAll({
//             // limit: limit,
//             // offset: offset,
//             order: [['createdAt', 'DESC']]            
//         })
//         res.status(200).json(orders);
//     } catch (error) {
//         res.status(400);
//         throw new Error(error.message || "Can't get all users");
//     }
// });



// Define route to call gRPC function
const getUserOrder = async (req, res) => {

    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    console.log(user,"user");
    const userId = user.id;

    
    // const userId = req.query.id;
    // const userId = 1;
    console.log("hello ",userId);
    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        const orderItem = await getOrderItemsById(userId); // Call gRPC function
        res.json(orderItem); // Send the gRPC response as JSON
    } catch (error) {
        console.error("Error calling getOrderItemsById:", error);
        res.status(500).json({ error: error.details || "Internal server error" });
    }
};

const getAllUserOrderItems = async (req, res) => {

    try {
        const orderItem = await getAllOrderItems(); // Call gRPC function
        res.json(orderItem); // Send the gRPC response as JSON
    } catch (error) {
        console.error("Error calling getAllOrderItems:", error);
        res.status(500).json({ error: error.details || "Internal server error" });
    }
};

const getAddressByID = asyncHandler(async (req, res) => {

    const user = req.headers['x-user'] ? JSON.parse(req.headers['x-user']) : null;
    console.log(user,"user");
    const id = user.id;


    // const id = req.query.id;
    try {
        const address = await Address.findOne({ where: { userId: id } });
        res.status(200).json(address);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't get Address");
    }
});











const createError = asyncHandler(async (req, res) => {
    throw new Error("This is an error");

});

module.exports = { getAllUsers, createError, updateUser, getUserByID, getAll, createShippingAddress, updateShippingAddress, getUserOrder, getAddressByID, updateUserProfile, getAllUserOrderItems };







