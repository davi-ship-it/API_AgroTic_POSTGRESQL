import { pool } from '../../database/conexion.js';

export const setCultivoXepa = async (req, res) => {
  const { fk_id_cultivo, fk_id_epa } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO cultivos_x_epa (fk_id_cultivo, fk_id_epa) VALUES ($1, $2) RETURNING *`,
      [fk_id_cultivo, fk_id_epa]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCultivosXepa = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cultivos_x_epa');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCultivoXepaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM cultivos_x_epa WHERE pk_id_cultivos_x_epa = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putCultivoXepa = async (req, res) => {
  const { id } = req.params;
  const { fk_id_cultivo, fk_id_epa } = req.body;
  try {
    const result = await pool.query(
      `UPDATE cultivos_x_epa SET fk_id_cultivo = $1, fk_id_epa = $2 WHERE pk_id_cultivos_x_epa = $3 RETURNING *`,
      [fk_id_cultivo, fk_id_epa, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCultivoXepa = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM cultivos_x_epa WHERE pk_id_cultivos_x_epa = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
