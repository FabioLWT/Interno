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
        zero_quilometro VARCHAR(3),
        nivel_conforto INTEGER CHECK (nivel_conforto >= 1 AND nivel_conforto <= 5),
        local_descanso GEOGRAPHY(POINT, 4326),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.query(query);
    console.log("Tabela 'veiculos' criada ou já existente.");
  },
};

module.exports = Veiculos;
