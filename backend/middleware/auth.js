const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("Headers recebidos:", req.headers);
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);
  const token = authHeader?.split(" ")[1];
  console.log("Token extraído:", token);
  if (!token) return res.status(401).json({ error: "Nenhum token fornecido" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Erro na validação do token:", error.message);
    res.status(401).json({ error: "Token inválido" });
  }
};
