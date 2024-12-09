const { where } = require("sequelize");
const { Product } = require("../../config/db");
const { Op } = require("sequelize");


const search = async (req, res) => {
  const page = req.query.page;
  const limit = 10;

  let offset = limit * (page - 1);
  // console.log( '==========',page, limit, offset);
  try {
    const { keyword } = req.query;
    console.log('Function called', keyword, limit, offset);

    const product = await Product.findAndCountAll({
      limit: limit,
      offset: offset,
      where: {
        [Op.or]: [
          { productName: { [Op.like]: `%${keyword}%` } },
          { productDescription: { [Op.like]: `%${keyword}` } },
        ],
      },
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
    res.status(200).json(product);
  } catch (error) {
    console.log('Error', error);
    res.status(404).json({ message: 'An error occured' });
  }
};


module.exports = search;