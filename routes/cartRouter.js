const express = require("express");
const cartController = require("../controllers/cartController");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

router.post("/add-to-cart", cartController.addToCart);
router.get("/get-cart-items/:userId", cartController.getCartItems);
router.delete("/remover-item/:cartItemId", cartController.removeItemFromCart);
// router.delete("/cart-items/:itemId", async (req, res) => {
//   const itemId = parseInt(req.params.itemId); // Converte o ID do item para um número inteiro

//   try {
//     // Verifique se o item existe
//     const existingItem = await prisma.cartItem.findUnique({
//       where: { id: itemId },
//     });

//     if (!existingItem) {
//       return res.status(404).json({ error: "Item não encontrado" });
//     }

//     // Exclua o item
//     await prisma.cartItem.delete({
//       where: { id: itemId },
//     });

//     res.json({ message: "Item excluído com sucesso" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Erro ao excluir o item", error: `${error}` });
//   }
// });

module.exports = router;
