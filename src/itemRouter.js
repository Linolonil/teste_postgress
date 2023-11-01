// itemRouter.js
const express = require("express");
const itemController = require("../controllers/itemController");

const router = express.Router();

router.post("/criar-item", itemController.criarItem);
router.get("/consultar-itens", itemController.consultarItens);
router.put("/definir-visibilidade/:itemId", itemController.definirVisibilidade);
router.delete("/excluir-item/:itemId", itemController.excluirItem);

router.post("/criar-categoria", itemController.criarCategoria);
router.get("/consultar-categorias", itemController.consultarCategoria);

module.exports = router;
