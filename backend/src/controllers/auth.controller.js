const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const TOKEN_EXPIRATION = "15m";
const REFRESH_EXPIRATION = "7d";

const refreshTokens = new Set();

const generateToken = (user, type = "access") => {
  const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
  const expiresIn = type === "access" ? TOKEN_EXPIRATION : REFRESH_EXPIRATION;

  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashed },
    });

    res.status(201).json({ message: "User created" });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const accessToken = generateToken(user, "access");
  const refreshToken = generateToken(user, "refresh");

  refreshTokens.add(refreshToken);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken, refreshToken });
};

exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token || !refreshTokens.has(token)) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const accessToken = generateToken(payload, "access");
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: "Token no válido" });
  }
};

exports.logout = (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    refreshTokens.delete(token);
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Sesión cerrada exitosamente" });
};
