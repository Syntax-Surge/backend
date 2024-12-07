const { Op, where } = require("sequelize");
const { Product, Category } = require("../../config/db");

const filter = async (req, res) => {
  try {
      const { minPrice, maxPrice, minWeight, maxWeight, categoryName } = req.query;

      const conditions = {
          [Op.and]: [],
      };

      if (minPrice) conditions[Op.and].push({ unitPrice: { [Op.gte]: parseFloat(minPrice) } });
      if (maxPrice) conditions[Op.and].push({ unitPrice: { [Op.lte]: parseFloat(maxPrice) } });
      if (minWeight) conditions[Op.and].push({ unitWeight: { [Op.gte]: parseFloat(minWeight) } });
      if (maxWeight) conditions[Op.and].push({ unitWeight: { [Op.lte]: parseFloat(maxWeight) } });
      // if (categoryId) conditions[Op.and].push({ categoryId: parseInt(categoryId) });

      const products = await Product.findAll({
          where: conditions,
          include: [
              {
                  model: Category,
                  attributes: ['id','name'], 
                  where: categoryName ? { name : categoryName } : undefined,
              },
          ],
      });

      res.status(200).json(products);
  } catch (error) {
      console.error("Error filtering products:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = filter;