const db = require("../config/db");

const Veiculos = {
  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS veiculos (
        id SERIAL PRIMARY KEY,
        placa VARCHAR(10) UNIQUE NOT NULL,
        descricao TEXT,
        ano INTEGER NOT NULL,
        modelo_id INTEGER REFERENCES modelos(id),
        cor VARCHAR(30),
        finalidade VARCHAR(50),
        local_descanso POINT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(query);
    console.log("Tabela 'veiculos' criada ou já existente.");
  },
};

module.exports = Veiculos;
