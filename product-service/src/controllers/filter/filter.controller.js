const { Op, where } = require('sequelize');
const { Product, Category } = require('../../config/db');

const filter = async (req, res) => {
  console.log('filter');

  try {
    const { minPrice, maxPrice, minWeight, maxWeight, catogories } = req.query;
    console.log(req.query.categories);

    const conditions = {
      [Op.and]: [],
    };

    if (minPrice)
      conditions[Op.and].push({
        unitPrice: { [Op.gte]: parseFloat(minPrice) },
      });
    if (maxPrice)
      conditions[Op.and].push({
        unitPrice: { [Op.lte]: parseFloat(maxPrice) },
      });
    if (minWeight)
      conditions[Op.and].push({
        unitWeight: { [Op.gte]: parseFloat(minWeight) },
      });
    if (maxWeight)
      conditions[Op.and].push({
        unitWeight: { [Op.lte]: parseFloat(maxWeight) },
      });
    // if (categoryId) conditions[Op.and].push({ categoryId: parseInt(categoryId) });

    // Parse and apply category filters if provided
    let categoryFilter = undefined;
    if (catogories) {
      const categoryIds = Array.isArray(catogories)
        ? catogories.map(Number)
        : JSON.parse(catogories);
      categoryFilter = { id: { [Op.in]: categoryIds } };
    }

    // Query products with conditions and category filters
    const products = await Product.findAll({
      where: conditions,
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
          where: categoryFilter,
        },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = filter;
