const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CartModel {
  async addToCart(itemId) {
    // Use um valor de userId fixo ou padrão (por exemplo, 1) para o usuário padrão
    const userId = 1;
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        itemId,
      },
    });
    return cartItem;
  }

  async getCartItems() {
    // Use o mesmo valor de userId fixo ou padrão (por exemplo, 1) para o usuário padrão
    const userId = 1;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        item: true,
      },
    });
    return cartItems;
  }
}

module.exports = CartModel;
