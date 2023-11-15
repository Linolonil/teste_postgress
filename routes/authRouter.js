// routes/auth.js
const express = require("express");
const router = express.Router();
const { generateToken } = require("../controllers/authController");
const { checkAndInvalidateToken } = require("../controllers/authController");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

router.post("/createManager", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        username: username, // Nome de usuário do gerente
        password: password, // Senha segura
        role: "gerente", // Papel de gerente
        // Outros campos do usuário, se aplicável
      },
    });

    res.json({ message: "Usuário gerente criado com sucesso", user });
  } catch (error) {
    console.error("Erro ao criar usuário gerente:", error);
    res.status(500).json({ error: "Erro ao criar usuário gerente" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verifique se o usuário existe no banco de dados
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verifique se a senha está correta
    if (password !== user.password) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // Verificar e invalidar token, se aplicável
    await checkAndInvalidateToken(user.id);

    // Ative o menu apenas para o gerente atual
    await prisma.user.update({
      where: { id: user.id },
      data: { menuVisible: true },
    });

    // Desative o menu para todos os outros gerentes
    await prisma.user.updateMany({
      where: {
        role: "gerente",
        NOT: { id: user.id },
      },
      data: { menuVisible: false },
    });

    // Gere um novo token JWT e associe-o ao usuário
    const token = generateToken(user.id);

    // Atualize o token do usuário no banco de dados
    await prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Rota para alternar menuVisible para um usuário específico
router.post("/toggle-menu", async (req, res) => {
  try {
    const { username, userId } = req.body;

    // Verifique se o usuário atual é um gerente e tem permissão para alternar o menuVisible
    const requestingUser = await prisma.user.findUnique({
      where: { username },
    });
    console.log(requestingUser);
    if (!requestingUser || requestingUser.role !== "gerente") {
      return res
        .status(403)
        .json({ error: "Você não tem permissão para executar esta ação" });
    }

    // Consulte o usuário no banco de dados pelo userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Alterne o valor de menuVisible (se estiver ativo, desative, e vice-versa)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { menuVisible: !user.menuVisible },
    });

    res.json({
      message: "menuVisible alternado com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao alternar menuVisible:", error);
    res.status(500).json({ error: "Erro ao alternar menuVisible" });
  }
});

module.exports = router;
