const { Op, where } = require("sequelize");
const { Product } = require("../../config/db");

const filter = async (req,res) => {
    try {
        const {
            minPrice,
            maxPrice,
            categories,
            discount,
            // Add more after the UI implementation
            limit = 10,
            offset = 0,
        } = req.body;

        const filters = {};

        if (minPrice && maxPrice) filters.price = { [Op.between]: [minPrice, maxPrice]};
        if (discount === 'true') filters.discount = true;
        if (categories) {
            const categoryList = categories.split(',');
            filters.category = {[Op.in]: categoryList}
        }

        const products = await Product.findAll({
            where: filters,
            order: [['createdAt','DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        })

        res.status(200).json(products);

    } catch (error) {
        console.log("Error",error);
        res.status(404).json({message:"An error occured"})
    }
}

module.exports = filter;