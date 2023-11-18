const express = require("express");
const { verifyToken } = require("../controllers/authController");
const vendaController = require("../controllers/vendaController");

const router = express.Router();

router.get("/consultar-venda", async (req, res) => {
  const token = req.headers.authorization;
  const userId = verifyToken(token);

  if (userId === null) {
    res.status(401).json({ error: "Token inválido" });
  } else {
    vendaController.consultarVenda(userId, req, res);
  }
});

router.post("/criar-venda", vendaController.criarVenda);

module.exports = router;
