const asyncHandler = require('express-async-handler');
const { Product } = require('../config/db');
const cloudinary = require('../config/cloudinaryConfig');

const getProducts = asyncHandler(async (req, res) => {
  //   console.log('Get Products');
  const page = req.query.page;
  const limit = 8;
  console.log('get Customer', page, limit);
  let offset = limit * (page - 1);
  try {
    const products = await Product.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Can't get Products");
  }
});

// get one product
const getProduct = asyncHandler(async (req, res) => {
  console.log('get one product');

  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: 'No longer product!' });
    return;
  }

  try {
    // get product
    const product = await Product.findOne({ where: { id } });
    // console.log(product);
    res.status(200).json(product);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Can't get Product");
  }
});

// tempory fuction
// get review 
const getReview = asyncHandler(async (req, res) => {
  console.log('get review');

//   const id = req.params.id;

//   if (!id) {
//     res.status(400).send({ message: 'No longer product!' });
//     return;
//   }

  try {
    // get review
    const product = await Product.findOne({ where: { id } });
    // console.log(product);
    res.status(200).json(product);
  } catch (error) {
    res.status(400);
    throw new Error(error.message || "Can't get Product");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  // console.log("Create Product");
  const {
    productName,
    productDescription,
    pictureLocation,
    unitWeight,
    unitPrice,
    availableQuantity,
    categoryId,
  } = req.body;

  if (
    !productName ||
    !unitWeight ||
    !unitPrice ||
    !availableQuantity ||
    !categoryId
  ) {
    res.status(400).send({ message: 'Missing required fields!' });
    return;
  }

  try {
    const product = {
      productName,
      productDescription,
      pictureLocation,
      unitWeight,
      unitPrice,
      availableQuantity,
      categoryId,
    };

    const data = await Product.create(product);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500);
    throw new Error(
      error.message || 'Some error occurred while creating the Product.'
    );
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // console.log("Update Product", id, req.body);
  const {
    productName,
    productDescription,
    pictureLocation,
    unitWeight,
    unitPrice,
    availableQuantity,
    categoryId,
  } = req.body;

  if (
    !productName ||
    !unitWeight ||
    !unitPrice ||
    !availableQuantity ||
    !categoryId
  ) {
    res.status(400).send({ message: 'Missing required fields!' });
    return;
  }

  try {
    const existingProduct = await Product.findOne({ where: { id } });

    if (!existingProduct) {
      res
        .status(404)
        .send({ message: `Cannot find the Product with id ${id}` });
      return;
    }

    // Delete the old image if it exists
    if (existingProduct.pictureLocation) {
      const imageUrl = existingProduct.pictureLocation;

      // Use regex to extract the public ID from the URL
      const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
      const publicId = publicIdMatch ? publicIdMatch[1] : null;

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      } else {
        console.warn('Unable to extract publicId from:', imageUrl);
      }
    }

    const updatedProduct = {
      productName,
      productDescription,
      pictureLocation,
      unitWeight,
      unitPrice,
      availableQuantity,
      categoryId,
    };

    await Product.update(updatedProduct, {
      where: { id },
      returning: true,
    });

    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500);
    throw new Error(error.message || 'Cannot update Product');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: 'Invalid Product ID' });
    return;
  }
  try {
    const existingProduct = await Product.findOne({ where: { id } });

    if (!existingProduct) {
      res
        .status(404)
        .send({ message: `Cannot find the Product with id ${id}` });
      return;
    }

    // Delete the old image if it exists
    if (existingProduct.pictureLocation) {
      const imageUrl = existingProduct.pictureLocation;

      // Use regex to extract the public ID from the URL
      const publicIdMatch = imageUrl.match(/\/v\d+\/(.+)\.\w+$/);
      const publicId = publicIdMatch ? publicIdMatch[1] : null;

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      } else {
        console.warn('Unable to extract publicId from:', imageUrl);
      }
    }

    await Product.destroy({ where: { id } });
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500);
    throw new Error(error.message || 'Cannot delete Product');
  }
});

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
};
