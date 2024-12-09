const { Op, where } = require("sequelize");
const { Product, Category } = require("../../config/db");

const filter = async (req, res) => {
  const page = req.query.page;
  const limit = 10;

  let offset = limit * (page - 1);
  // console.log( '==========',page, limit, offset);
  try {
    const { minValue, maxValue, minWeight, maxWeight, filteredCategory } =
      req.query;

    const conditions = {
      [Op.and]: [],
    };

    if (minValue)
      conditions[Op.and].push({
        unitPrice: { [Op.gte]: parseFloat(minValue) },
      });
    if (maxValue)
      conditions[Op.and].push({
        unitPrice: { [Op.lte]: parseFloat(maxValue) },
      });
    if (minWeight)
      conditions[Op.and].push({
        unitWeight: { [Op.gte]: parseFloat(minWeight) },
      });
    if (maxWeight)
      conditions[Op.and].push({
        unitWeight: { [Op.lte]: parseFloat(maxWeight) },
      });

    // Parse and apply category filters if provided
    let categoryFilter = undefined;
    if (filteredCategory) {
      const categoryIds = Array.isArray(filteredCategory)
        ? filteredCategory.map(Number)
        : JSON.parse(filteredCategory);
      categoryFilter = { id: { [Op.in]: categoryIds } };
    }

    // console.log(conditions);

    // Query products with conditions and category filters
    const products = await Product.findAndCountAll({
      limit: limit,
      offset: offset,
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