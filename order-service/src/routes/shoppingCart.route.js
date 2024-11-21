// const express = require("express");
// const addToCart = require("../controllers/shoppingcart/shoppingcart.controller");

// const cartRouter = express.Router();

// cartRouter.post("/add", addToCart);
// // cartRouter.post("/remove", removeFromCart);
// // cartRouter.post("/get", getCart);

// module.exports = cartRouter;

const express = require("express");
const {
  addToCart,
  removeCart,
  getCart,
} = require("../controllers/shoppingcart/shoppingcart.controller.js");

const router = express.Router();

router.post("/add", addToCart);
router.delete("/remove", removeCart);
router.get("/:userId", getCart);

module.exports = router;
