import { pool } from '../../database/conexion.js';

export const setBodega = async (req, res) => {
  const { bod_nombre, bod_zona } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO bodega (bod_nombre, bod_zona) VALUES ($1, $2) RETURNING *`,
      [bod_nombre, bod_zona]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBodegas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bodega');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBodegaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM bodega WHERE pk_id_bodega = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putBodega = async (req, res) => {
  const { id } = req.params;
  const { bod_nombre, bod_zona } = req.body;
  try {
    const result = await pool.query(
      `UPDATE bodega SET bod_nombre = $1, bod_zona = $2 WHERE pk_id_bodega = $3 RETURNING *`,
      [bod_nombre, bod_zona, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBodega = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM bodega WHERE pk_id_bodega = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

