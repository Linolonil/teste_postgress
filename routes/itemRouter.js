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

router.put("/editar/:itemId", itemController.editarItem);
router.put("/definir-visibilidade/:itemId", itemController.definirVisibilidade);
router.delete("/excluir-item/:itemId", itemController.excluirItem);

router.post("/criar-categoria", itemController.criarCategoria);
router.get("/consultar-categorias", itemController.consultarCategoria);

module.exports = router;
