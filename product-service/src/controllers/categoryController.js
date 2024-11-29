const asyncHandler = require("express-async-handler")
const {Category} = require("../config/db");
const { Op } = require('sequelize');
const cloudinary = require('../config/cloudinaryConfig');

const getCategories = asyncHandler(async (req, res) => {
    console.log("Get Category");
    try {
        // Fetch categories along with their subcategories
        const categories = await Category.findAll({
            where: {
                parent_id: null, // Fetch only parent categories
            },
            include: [
                {
                    model: Category, // Include subcategories
                    as: 'subcategories',
                    attributes: ['id', 'name', 'description', 'image'], 
                },
            ],
            attributes: ['id', 'name', 'description', 'image'], 
        });

        // Map data into the desired format
        const formattedCategories = categories.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            image: category.image,
            subcategories: category.subcategories.map((subcategory) => ({
                id: subcategory.id,
                name: subcategory.name,
                description: subcategory.description,
                image: subcategory.image
            })),
        }));
        res.status(200).json(formattedCategories);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't get Categories");
    }
})

const getSubCategories = asyncHandler(async (req, res) => {
    console.log("Get Sub Category");
    try {
        // Fetch categories along with their subcategories
        const subCategories = await Category.findAll({
            where: {
                parent_id: { [Op.ne]: null }
            }
        });

        // Map data into the desired format
        const formattedSubCategories = subCategories.map((subCategory) => ({
            id: subCategory.id,
            name: subCategory.name,
            description: subCategory.description,
            image: subCategory.image
        }));
        res.status(200).json(formattedSubCategories);
    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't get Sub Categories");
    }
})

const createCategory = asyncHandler(async (req, res) => {
    const { name, parentValue, description, image} = req.body
    if (!name) {
        res.status(400).send({ message: "Missing required fields!" });
        return
    }

    else {     
        var parent_id = parentValue;

        if (parent_id == "") {
            parent_id = null;
        }

        try {
            const existingCategory = await Category.findOne({ where: { name: name } });

            if (existingCategory) {
                res.status(400).send({ message: "Category already exists." });
                return;
            }
            const category = {
                name, parent_id, description, image
            };
            console.log(category);
            const data = await Category.create(category)
            console.log("data",data);
            res.status(201).json(data);
    
        } catch (error) {
            console.log("Error creating category:",error)
            res.status(500);
    
            throw new Error(error.message || "Some error occurred while creating the Category.");
        }
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    console.log(id, req.body,"update category")
    const { name, parentValue, description, image } = req.body
    if (!name) {
        res.status(400).send({ message: "Missing required fields!" });
        return
    }
    else {        
        try {   
            const existingCategory = await Category.findOne({ where: { id: id } });

            if (!existingCategory) {
                res.status(404).send({ message: `Cannot find the Category ${id}` });
                return;
            }

            // Delete the old image if new image is different.
            if (image != existingCategory.image ) {
                const imageUrl = existingCategory.image;
                
                // Use regex to extract the public ID from the URL
                const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.\w+$/); 
                const publicId = publicIdMatch ? publicIdMatch[1] : null;

                if (publicId) {
                    await cloudinary.uploader.destroy(publicId);
                } else {
                    console.warn("Unable to extract publicId from:", imageUrl);
                }
            }

            var parent_id = parentValue;

            if (parent_id == "") {
                parent_id = null;
            }

            const updateCategory = {
                name, parent_id, description, image 
            };
            console.log(updateCategory);
            const data = await Category.update(updateCategory, {
                where: { id: id },
                retuning: true,
            })
            res.status(200).json(data);
            console.log(data);
    
        } catch (error) {
            console.log("Error updating category:",error)
            res.status(500);
            throw new Error(error.message || "Cannot update category");
        }
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    const id = req.params.id
    if (!id) {
        res.status(400).send({ message: `Can't remove, Invalid Category ${id}` });
        return
    }
    try {
        const existingCategory = await Category.findOne({ where: { id: id } });

        if (!existingCategory) {
            res.status(404).send({ message: `Cannot find the Category ${id}` });
            return;
        }

        if (existingCategory.image) {
            const imageUrl = existingCategory.image;
            
            // Use regex to extract the public ID from the URL
            const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.\w+$/); 
            const publicId = publicIdMatch ? publicIdMatch[1] : null;

            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            } else {
                console.warn("Unable to extract publicId from:", imageUrl);
            }
        }
        
        await Category.destroy({ where: { parent_id: id } });

        const data = await Category.destroy({
            where: { id: id },
            returning: true
        })
        res.status(200).json(data);

    } catch (error) {
        res.status(400);
        throw new Error(error.message || "Can't remove Category");
    }
})

module.exports = {createCategory, updateCategory, getCategories, deleteCategory, getSubCategories};