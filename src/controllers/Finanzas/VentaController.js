import { pool } from '../../database/conexion.js';

export const getVentas = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM venta");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVentaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM venta WHERE pk_id_venta = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createVenta = async (req, res) => {
  const { ven_cantidad, ven_fecha, fk_id_cosecha } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO venta (ven_cantidad, ven_fecha, fk_id_cosecha)
       VALUES ($1, $2, $3) RETURNING *`,
      [ven_cantidad, ven_fecha, fk_id_cosecha]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVenta = async (req, res) => {
  const { id } = req.params;
  const { ven_cantidad, ven_fecha, fk_id_cosecha } = req.body;
  try {
    const result = await pool.query(
      `UPDATE venta
       SET ven_cantidad = $1, ven_fecha = $2, fk_id_cosecha = $3
       WHERE pk_id_venta = $4
       RETURNING *`,
      [ven_cantidad, ven_fecha, fk_id_cosecha, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteVenta = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM venta WHERE pk_id_venta = $1", [id]);
    res.json({ message: "Venta eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

