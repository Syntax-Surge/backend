const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/shoppingcart/shoppingcart.controller.js");
// const authMiddleware = require("../middleware/auth.js");

const cartRouter = express.Router();

// cartRouter.post("/add", addToCart);
// cartRouter.post("/remove", removeFromCart);
// cartRouter.post("/get", getCart);

module.exports = cartRouter;
