const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.register = async (req, res) => {
  const { nome, email, senha, data_nascimento } = req.body;
  try {
    const hashedPassword = await argon2.hash(senha);

    const { rows } = await db.query(
      "INSERT INTO usuarios (nome, email, senha, data_nascimento) VALUES ($1, $2, $3, $4) RETURNING id, nome, email",
      [nome, email, hashedPassword, data_nascimento]
    );

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ ...rows[0], token });
  } catch (error) {
    res.status(500).json({ error: "Falha no registro" });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { rows } = await db.query("SELECT * FROM usuarios WHERE email = $1", [
      email,
    ]);
    if (rows.length === 0 || !(await argon2.verify(rows[0].senha, senha))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }
    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      id: rows[0].id,
      nome: rows[0].nome,
      email: rows[0].email,
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Falha no login" });
  }
};
