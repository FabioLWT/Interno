const db = require("../config/db");

exports.getAll = async (req, res) => {
  console.log("Tentando buscar o histórico...");
  try {
    const { rows } = await db.query(
      "SELECT h.*, v.placa FROM historico h JOIN veiculos v ON h.veiculo_id = v.id ORDER BY h.criado_em DESC"
    );
    console.log("Histórico encontrado:", rows);
    res.json(rows || []);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error.stack);
    res
      .status(500)
      .json({ error: "Falha ao buscar histórico", details: error.message });
  }
};

module.exports = exports;
