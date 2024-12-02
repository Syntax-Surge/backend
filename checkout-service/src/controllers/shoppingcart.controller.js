const asyncHandler = require("express-async-handler");
const { ShoppingCart } = require("../config/db.js");
const {
  getProductsByIds,
  getProductById,
} = require("../grpc/productClient.js");

// Add to Cart
const addToCart = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId || !productId || !quantity) {
    res.status(400).json({ message: "Missing required fields!" });
    return;
  }

  try {
    // Check if the product already exists in the user's cart
    const existingCartItem = await ShoppingCart.findOne({
      where: { userId, productId },
    });
    // console.log("dddd", existingCartItem);

    if (existingCartItem) {
      // If exists, update the quantity
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json(existingCartItem);
    }

    // If not, create a new cart item
    const cartItem = await ShoppingCart.create({
      userId,
      productId,
      quantity,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Error adding item to cart.");
  }
});

// Remove from Cart
const removeCart = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    res.status(400).json({ message: "Missing required fields!" });
    return;
  }

  try {
    const cartItem = await ShoppingCart.findOne({
      where: { userId, productId },
    });

    if (!cartItem) {
      res.status(404).json({ message: "Cart item not found!" });
      return;
    }

    await cartItem.destroy();
    res.status(200).json({ message: "Item removed from cart successfully!" });
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Error removing item from cart.");
  }
});

// Get Cart
const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ message: "Missing user ID!" });
    return;
  }

  try {
    const cartItems = await ShoppingCart.findAll({
      where: { userId },
    });

    if (!cartItems.length) {
      res.status(404).json({ message: "No items in the cart!" });
      return;
    }

    // Fetch product details for each cart item
    const cartItemsWithProductDetails = await Promise.all(
      cartItems.map(async (item) => {
        try {
          const product = await getProductById(item.productId); // gRPC call
          return { ...item.toJSON(), product }; // Combine cart item with product details
        } catch (error) {
          console.error(
            `Failed to fetch product details for productId ${item.productId}`,
            error.message
          );
          return { ...item.toJSON(), product: null }; // Return null product details on failure
        }
      })
    );

    res.status(200).json(cartItemsWithProductDetails);
  } catch (error) {
    res.status(500);
    throw new Error(error.message || "Error fetching cart items.");
  }
});

module.exports = { addToCart, removeCart, getCart };