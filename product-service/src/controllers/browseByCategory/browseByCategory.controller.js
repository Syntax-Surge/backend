const { where } = require("sequelize");
const { Product, Category } = require("../../config/db");


const browseByCategory = async (req, res) => {
    try {
        console.log("Executing browse by category");
        
        const {
            id,
            limit = 10,
            offset = 0,  
        } = req.query;

        console.log("Id is", id);
        
        if(!id){
            return res.status(400).json({ error: "No Category Selected" });
        }

        const products = await Product.findAll({
            where: { categoryId: parseInt(id) },
            include: [
                {
                    model: Category,
                    attributes: ['id', 'name'],
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset)
        })

        res.status(200).json(products)
    } catch (error) {
        console.log("Browse error",error);
        res.status(500).json({ error: error.message })
    }
}

module.exports = browseByCategory;