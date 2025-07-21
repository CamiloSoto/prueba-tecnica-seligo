const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const generateToken = (user, type = "access") => {
  const secret =
    type === "access" ? process.env.JWT_SECRET : process.env.JWT_REFRESH_SECRET;
  const expiresIn = type === "access" ? "15m" : "7d";

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
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const accessToken = generateToken(user, "access");
  const refreshToken = generateToken(user, "refresh");

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  res.json({ accessToken, refreshToken });
};

exports.refreshToken = (req, res) => {
  const token = req.body.token;
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateToken(payload, "access");
    res.json({ accessToken });
  } catch {
    res.sendStatus(403);
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Logged out" });
};
