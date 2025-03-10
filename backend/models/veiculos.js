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

    // Inserções de dados de teste
    await db.query(
      `INSERT INTO veiculos (placa, descricao, ano, modelo_id, cor, finalidade, zero_quilometro, nivel_conforto, local_descanso) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_GeomFromText('POINT(-23.5 -46.6)', 4326)) 
       ON CONFLICT DO NOTHING`,
      ["ABC1234", "Veículo de teste", 2023, 1, "Branco", "Pessoal", "Não", 4]
    );
    await db.query(
      `INSERT INTO veiculos (placa, descricao, ano, modelo_id, cor, finalidade, zero_quilometro, nivel_conforto, local_descanso) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_GeomFromText('POINT(-23.6 -46.7)', 4326)) 
       ON CONFLICT DO NOTHING`,
      ["DEF5678", "Outro veículo", 2024, 1, "Preto", "Comercial", "Sim", 5]
    );
    await db.query(
      `INSERT INTO veiculos (placa, descricao, ano, modelo_id, cor, finalidade, zero_quilometro, nivel_conforto, local_descanso) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ST_GeomFromText('POINT(-23.7 -46.8)', 4326)) 
       ON CONFLICT DO NOTHING`,
      ["PAM-3434", "Veículo novo", 2025, 1, "Azul", "Pessoal", "Não", 3]
    );
  },
};

module.exports = Veiculos;
