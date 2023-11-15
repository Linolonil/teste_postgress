// itemRouter.js
const express = require("express");
const itemController = require("../controllers/itemController");
const { criarItem, consultarItens } = require("../controllers/itemController");
const { verifyToken } = require("../controllers/authController");

const router = express.Router();

router.post("/criar-item", async (req, res) => {
  const token = req.headers.authorization;
  const userId = verifyToken(token);

  if (userId === null) {
    res.status(401).json({ error: "Token inválido" });
  } else {
    criarItem(userId, req, res);
  }
});

router.get("/consultar-itens", async (req, res) => {
  const token = req.headers.authorization;
  const userId = verifyToken(token);

  if (userId === null) {
    res.status(401).json({ error: "Token inválido" });
  } else {
    consultarItens(userId, req, res);
  }
});
// router.get("/menu-itens", async (req, res) => {
//   try {
//     // Consulte o banco de dados para obter o ID do último gerente que fez login
//     const ultimoGerenteId = /* Obtenha o ID do último gerente de alguma forma */;

//     // Use o ID do último gerente para buscar os itens do menu associados a esse gerente
//     const itensDoUltimoGerente = await prisma.item.findMany({
//       where: {
//         userId: ultimoGerenteId,
//       },
//     });

//     res.json(itensDoUltimoGerente);
//   } catch (error) {
//     console.error("Erro ao buscar itens do último gerente logado:", error);
//     res.status(500).json({ error: "Erro ao buscar itens do último gerente logado" });
//   }
// });

router.put("/editar/:itemId", itemController.editarItem);
router.put("/definir-visibilidade/:itemId", itemController.definirVisibilidade);
router.delete("/excluir-item/:itemId", itemController.excluirItem);

router.post("/criar-categoria", itemController.criarCategoria);
router.get("/consultar-categorias", itemController.consultarCategoria);

module.exports = router;
