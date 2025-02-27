const db = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT v.*, m.nome AS modelo, b.nome AS marca FROM veiculos v JOIN modelos m ON v.modelo_id = m.id JOIN marcas b ON m.marca_id = b.id"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Falha ao buscar veículos" });
  }
};

exports.create = async (req, res) => {
  const { placa, descricao, ano, modelo_id, cor, finalidade, local_descanso } =
    req.body;
  try {
    const { rows } = await db.query(
      "INSERT INTO veiculos (placa, descricao, ano, modelo_id, cor, finalidade, local_descanso) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [placa, descricao, ano, modelo_id, cor, finalidade, local_descanso]
    );
    await db.query(
      "INSERT INTO historico (veiculo_id, acao, descricao) VALUES ($1, $2, $3)",
      [rows[0].id, "criado", `Veículo ${placa} criado`]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erro ao criar veículo:", error.stack);
    res
      .status(500)
      .json({ error: "Falha ao criar veículo", details: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { placa, descricao, ano, modelo_id, cor, finalidade, local_descanso } =
    req.body;
  try {
    let x, y;
    if (typeof local_descanso === "object") {
      x = local_descanso.x;
      y = local_descanso.y;
    } else {
      const coords = local_descanso.match(/\(([^,]+),\s*([^)]+)\)/);
      x = coords[1];
      y = coords[2];
    }

    const { rows } = await db.query(
      "UPDATE veiculos SET placa = $1, descricao = $2, ano = $3, modelo_id = $4, cor = $5, finalidade = $6, local_descanso = POINT($7, $8) WHERE id = $9 RETURNING *", // Ajustei colunas
      [placa, descricao, ano, modelo_id, cor, finalidade, x, y, id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    await db.query(
      "INSERT INTO historico (veiculo_id, acao, descricao) VALUES ($1, $2, $3)",
      [id, "atualizado", `Veículo ${placa} atualizado`]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error.stack);
    if (error.code === "23505") {
      res
        .status(400)
        .json({ error: "Placa já registrada", details: error.message });
    } else if (error.code === "23503") {
      res
        .status(400)
        .json({ error: "ID de modelo inválido", details: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Falha ao atualizar veículo", details: error.message });
    }
  }
};

exports.deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows: vehicleRows } = await db.query(
      "SELECT placa FROM veiculos WHERE id = $1",
      [id]
    );
    if (vehicleRows.length === 0) {
      return res.status(404).json({ error: "Veículo não encontrado" });
    }
    const placa = vehicleRows[0].placa;

    await db.query("DELETE FROM historico WHERE veiculo_id = $1", [id]);

    await db.query("DELETE FROM veiculos WHERE id = $1", [id]);

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar veículo:", error.stack);
    res.status(500).json({ error: "Falha ao deletar veículo" });
  }
};
