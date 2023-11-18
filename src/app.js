const express = require("express");
const app = express();
const cors = require("cors");
const { verifyToken } = require("../controllers/authController");
const { verificaUsername } = require("../controllers/authController");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3031;

require("dotenv").config();
app.use(cors());
app.use(express.json());

const itemRouter = require("../routes/itemRouter"); // Importe o roteador
const authRouter = require("../routes/authRouter"); // Importe o roteador
const vendaRouter = require("../routes/vendaRouter"); // Importe o roteador
//
let currentUserId = null;
const users = {};

// Rota protegida
app.get("/rota-protegida", async (req, res) => {
  const token = req.headers.authorization;
  const userId = verifyToken(token);

  if (userId === null) {
    res.status(401).json({ error: "Token inválido" });
  } else {
    const user = await verificaUsername(userId); // Use await aqui

    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado" });
      return;
    }

    if (!users[userId]) {
      // O usuário não está logado, permita o acesso
      users[userId] = true;
      res.json({ message: `${user}!` }); // Use `user` em vez de `user.username`
    } else if (users[userId]) {
      // O mesmo usuário já está logado, permita o acesso
      res.json({ message: `${user}!` });
    } else {
      // Outro usuário já está logado, deslogue-o antes de permitir o acesso
      // Implemente a lógica de logout do usuário atual aqui
      // Por exemplo, se você tem uma função de logout, você pode chamar:
      // logoutUser(currentUserId);
      // Ou outra lógica apropriada para fazer logout
      users[currentUserId] = false; // Marque o usuário atual como deslogado
      users[userId] = true; // Marque o novo usuário como logado
      res.json({ message: `Acesso autorizado para ${user}!` });
    }
  }
});

app.get("/menu", async (req, res) => {
  // Encontre o gerente com menuVisible definido como true
  const gerenteComMenuVisible = await prisma.user.findFirst({
    where: {
      role: "gerente",
      menuVisible: true,
    },
  });

  if (!gerenteComMenuVisible) {
    return res
      .status(404)
      .json({ error: "Nenhum gerente com menu visível encontrado" });
  }

  // Agora que você tem o gerente com menuVisible true, encontre os itens associados a esse gerente
  const menuItems = await prisma.item.findMany({
    where: {
      userId: gerenteComMenuVisible.id,
    },
  });

  res.json({
    menu: menuItems,
  });
});

// Use o roteador para definir as rotas
app.use("/itens", itemRouter);
app.use("/auth", authRouter);
app.use("/venda", vendaRouter);

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor Express em execução na porta ${PORT}`);
});
