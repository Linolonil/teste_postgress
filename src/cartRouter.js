const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.post("/add-to-cart", cartController.addToCart);
router.get("/get-cart-items/:userId", cartController.getCartItems);
router.delete("/remover-item/:cartItemId", cartController.removeItemFromCart);

module.exports = router;
