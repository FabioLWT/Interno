const db = require("../config/db");
const argon2 = require("argon2"); 

const Usuarios = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        data_nascimento DATE NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(query);
    console.log("Tabela 'usuarios' criada ou já existente.");

    
    const hashedPassword = await argon2.hash("senha123");
    await db.query(
      "INSERT INTO usuarios (nome, email, senha, data_nascimento) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
      ["José Silva", "jose@gmail.com", hashedPassword, "1990-01-01"]
    );
  },
};

module.exports = Usuarios;
