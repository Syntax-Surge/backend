const { where } = require("sequelize");
const { Product } = require("../../config/db");
const { Op } = require("sequelize");


const search = async (req,res) => {
    try {
        const { keyword, limit = 10, offset = 0 } = req.query;
        console.log("Function called",keyword,limit,offset);
        if(!keyword){
            console.log("Error",error);
            res.status(404).json({message:"Please enter a key word"});
        }
        const product = await Product.findAll({
            where: {
                [Op.or]:[
                    { productName: {[Op.like]: `%${keyword}%`}},
                    { productDescription: {[Op.like]: `%${keyword}`}},
                ],
            },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.status(200).json(product);
    } catch (error) {
        console.log("Error",error);
        res.status(404).json({message:"An error occured"});
    }
}

module.exports = search;