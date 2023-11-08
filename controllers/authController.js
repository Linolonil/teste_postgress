// authController.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET; // Use a variável de ambiente para o segredo
  const token = jwt.sign({ userId }, secret, { expiresIn: "6h" }); // Personalize o tempo de expiração
  return token;
};

const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    return decoded.userId;
  } catch (error) {
    return null; // Token inválido
  }
};

const checkAndInvalidateToken = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (user.token) {
    // Verifique se o token está expirado
    const tokenIsValid = await verifyToken(user.token);

    if (!tokenIsValid) {
      // Token expirado, invalidar
      await prisma.user.update({
        where: { id: userId },
        data: { token: null },
      });
    } else {
      // Token válido, invalidar
      await prisma.user.update({
        where: { id: userId },
        data: { token: null },
      });
    }
  }
};

const verificaUsername = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      return user.username; // Retorne o nome de usuário
    } else {
      console.error("Usuário não encontrado no banco de dados.");
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar o nome de usuário no banco de dados:", error);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  checkAndInvalidateToken,
  verificaUsername,
};
