const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(express.json());

const itemRouter = require("./itemRouter"); // Importe o roteador
const cartRouter = require("./cartRouter"); // Importe o roteador

// Use o roteador para definir as rotas
app.use("/itens", itemRouter);
app.use("/cart", cartRouter);

// Inicie o servidor
app.listen(3030, () => {
  console.log(`Servidor Express em execução na porta 3030 `);
});
