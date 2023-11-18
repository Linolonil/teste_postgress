const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const consultarVenda = async (userId, req, res) => {
  try {
    const itens = await prisma.sale.findMany({
      where: {
        userId: userId, // Certifique-se de que userId é o mesmo tipo que o userId no banco de dados
      },
    });
    res.json(itens); // Retorne os itens diretamente, sem colocá-los em um array adicional
  } catch (error) {
    console.error("Erro ao consultar itens do usuário:", error);
    res.status(500).json({ error: "Erro ao consultar itens do usuário" });
  }
};

const criarVenda = async (req, res) => {
  try {
    const {
      items,
      total,
      paymentMethod,
      delivery,
      address,
      trip,
      table,
      note,
      hour,
    } = req.body;

    const manager = await prisma.user.findFirst({
      where: {
        role: "gerente",
        menuVisible: true,
      },
    });

    if (!manager) {
      return res.status(404).json({ message: "No manager found" });
    }

    const newSale = await prisma.sale.create({
      data: {
        items,
        total,
        paymentMethod,
        delivery,
        address,
        trip,
        table,
        note,
        hour,
        userId: manager.id,
      },
    });

    res.status(201).json(newSale);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  criarVenda,
  consultarVenda,
};
