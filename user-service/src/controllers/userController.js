const asyncHandler = require("express-async-handler")
const {User} = require("../config/db");
const { where } = require("sequelize");

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

    const updateUser = asyncHandler(async (req, res) => {
        const data = req.params.data;
        const id = req.query.id;
        console.log(data);
        console.log(id);
        let updateFields = {};
        if (data.firstName) updateFields.firstName = data.firstName;
        if (data.lastName) updateFields.lastName = data.lastName;
        if (data.email) updateFields.email = data.email;
        if (data.password) updateFields.password = data.password;
        if (data.contactNo) updateFields.contactNo = data.contactNo;
        if (data.profileImage) updateFields.profileImage = data.profileImage;
        try {
            const updateUser = await User.update(
                updateFields          
            ,{
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

    const createBillingAddress = asyncHandler(async (req, res) => {
        const data = req.params.data;
        const id = req.query.id;
        console.log(data);
        console.log(id);
        let billingAddress = {};
        if (data.line1) updateFields.billingAddressLine1 = data.line1;
        if (data.line2) updateFields.billingAddressLine2 = data.line2;
        if (data.city) updateFields.billingCity = data.city;
        if (data.state) updateFields.billingState = data.state;
        if (data.postalCode) updateFields.billingPostalCode = data.postalCode;
        if (data.country) updateFields.billingCountry = data.country;
        try {
            const users = await User.create(
                billingAddress            
            , {where: {
                id: id
            },
        })
            res.status(200).json(users);
        } catch (error) {
            res.status(400);
            throw new Error(error.message || "Can't add billing address");
        }
    });

    const createShippingAddress = asyncHandler(async (req, res) => {
        const data = req.params.data;
        const id = req.query.id;
        console.log(data);
        console.log(id);
        let shippingAddress = {};
        if (data.line1) updateFields.shippingAddressLine1 = data.line1;
        if (data.line2) updateFields.shippingAddressLine2 = data.line2;
        if (data.city) updateFields.shippingCity = data.city;
        if (data.state) updateFields.shippingState = data.state;
        if (data.postalCode) updateFields.shippingPostalCode = data.postalCode;
        if (data.country) updateFields.shippingCountry = data.country;
        try {
            const users = await User.create(
                shippingAddress            
            , {where: {
                id: id
            },
        })
            res.status(200).json(users);
        } catch (error) {
            res.status(400);
            throw new Error(error.message || "Can't add billing address");
        }
    });


    const updateBillingAddress = asyncHandler(async (req, res) => {
        const data = req.params.data;
        const id = req.query.id;
        console.log(data);
        console.log(id);
        let billingAddress = {};
        if (data.line1) updateFields.billingAddressLine1 = data.line1;
        if (data.line2) updateFields.billingAddressLine2 = data.line2;
        if (data.city) updateFields.billingCity = data.city;
        if (data.state) updateFields.billingState = data.state;
        if (data.postalCode) updateFields.billingPostalCode = data.postalCode;
        if (data.country) updateFields.billingCountry = data.country;
        try {
            const users = await User.update(
                billingAddress            
            , {where: {
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
        const data = req.params.data;
        const id = req.query.id;
        console.log(data);
        console.log(id);
        let shippingAddress = {};
        if (data.line1) updateFields.shippingAddressLine1 = data.line1;
        if (data.line2) updateFields.shippingAddressLine2 = data.line2;
        if (data.city) updateFields.shippingCity = data.city;
        if (data.state) updateFields.shippingState = data.state;
        if (data.postalCode) updateFields.shippingPostalCode = data.postalCode;
        if (data.country) updateFields.shippingCountry = data.country;
        try {
            const users = await User.update(
                shippingAddress            
            , {where: {
                id: id
            },
        })
            res.status(200).json(users);
        } catch (error) {
            res.status(400);
            throw new Error(error.message || "Can't add billing address");
        }
    });

    





const createError = asyncHandler(async (req, res) => {
    throw new Error("This is an error");
    
});

module.exports = { getAllUsers, createError, updateUser };







  