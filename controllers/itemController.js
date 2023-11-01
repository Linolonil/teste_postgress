// controllers/itemController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const criarItem = async (req, res) => {
  try {
    const itens = req.body; // Receba um array de itens no corpo da solicitação

    const novosItens = await Promise.all(
      itens.map(async (item) => {
        // Itere por cada item no array e crie-o no banco de dados
        const novoItem = await prisma.item.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            categoryId: item.categoryId,
            isVisible: true,
          },
        });

        return novoItem;
      })
    );

    res.json(novosItens);
  } catch (error) {
    console.error("Erro ao criar itens:", error);
    res.status(500).json({ error: "Erro ao criar itens" });
  }
};


const consultarItens = async (req, res) => {
  try {
    const itens = await prisma.item.findMany();
    res.json(itens);
  } catch (error) {
    console.error("Erro ao consultar itens:", error);
    res.status(500).json({ error: "Erro ao consultar itens" });
  }
};

const excluirItem = async (req, res) => {
  const itemId = parseInt(req.params.itemId);

  try {
    // Exclua o item com base no ID
    const itemExcluido = await prisma.item.delete({
      where: {
        id: itemId,
      },
    });

    res.json({ message: "Item excluído com sucesso", item: itemExcluido });
  } catch (error) {
    console.error("Erro ao excluir item:", error);
    res.status(500).json({ error: "Erro ao excluir item" });
  }
};

const criarCategoria = async (req, res) => {
  try {
    const { name } = req.body;

    // Verifique se o nome da categoria foi fornecido na solicitação
    if (!name) {
      return res
        .status(400)
        .json({ error: "O nome da categoria é obrigatório" });
    }

    // Crie a categoria no banco de dados
    const categoria = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json(categoria);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ error: "Ocorreu um erro ao criar a categoria" });
  } finally {
    await prisma.$disconnect();
  }
};

const consultarCategoria = async (req, res) => {
  try {
    // Consulta todas as categorias no banco de dados
    const categorias = await prisma.category.findMany();

    res.json(categorias);
  } catch (error) {
    console.error("Erro ao consultar categorias:", error);
    res
      .status(500)
      .json({ error: "Ocorreu um erro ao consultar as categorias" });
  } finally {
    await prisma.$disconnect();
  }
};

const definirVisibilidade = async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10); // Converte o ID de String para Int
  const { isVisible } = req.body;

  try {
    // Alterna o valor de isVisible
    const updatedItem = await prisma.item.update({
      where: {
        id: itemId,
      },
      data: {
        isVisible: isVisible, // Usa o operador de negação lógica para alternar o valor
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Erro ao atualizar visibilidade:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  criarItem,
  consultarItens,
  criarCategoria,
  consultarCategoria,
  excluirItem,
  definirVisibilidade,
};
