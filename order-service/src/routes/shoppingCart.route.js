const express = require("express");
const {
  addToCart,
  removeCart,
  getCart,
} = require("../controllers/shoppingcart/shoppingcart.controller.js");

const router = express.Router();

router.post("/add", addToCart);
router.delete("/remove/:productId", removeCart);
router.get("/:userId", getCart);

module.exports = router;
