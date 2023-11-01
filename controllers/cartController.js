const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CartModel = require("../model/cart.model");
const cartModel = new CartModel();

const addToCart = async (req, res) => {
  const { itemId, userId } = req.body; // Certifique-se de obter o userId apropriado
  try {
    const cartItem = await cartModel.addToCart(itemId, userId); // Passe o userId para o método addToCart
    res.json(cartItem);
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    res.status(500).json({ error: "Erro ao adicionar ao carrinho" });
  }
};

const getCartItems = async (req, res) => {
  try {
    const cartItems = await cartModel.getCartItems();
    res.json(cartItems);
  } catch (error) {
    console.error("Erro ao obter itens do carrinho:", error);
    res.status(500).json({ error: "Erro ao obter itens do carrinho" });
  }
};

const removeItemFromCart = async (req, res) => {
  const  cartItemId  = req.params.cartItemId;

  try {
    // Remova o item do carrinho com base no ID do item do carrinho
    await prisma.cartItem.delete({
      where: { id: parseInt(cartItemId) },
    });

    res.json({ message: "Item removido do carrinho com sucesso." });
  } catch (error) {
    console.error("Erro ao remover item do carrinho:", error);
    res.status(500).json({ error: "Erro ao remover item do carrinho" });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  removeItemFromCart,
};
