import { pool } from '../../database/conexion.js';

export const setMapa = async (req, res) => {
  const { mapa_nombre, mapa_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO mapas (mapa_nombre, mapa_url) VALUES ($1, $2) RETURNING *`,
      [mapa_nombre, mapa_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMapas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mapas');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMapaById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM mapas WHERE pk_id_mapa = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putMapa = async (req, res) => {
  const { id } = req.params;
  const { mapa_nombre, mapa_url } = req.body;
  try {
    const result = await pool.query(
      `UPDATE mapas SET mapa_nombre = $1, mapa_url = $2 WHERE pk_id_mapa = $3 RETURNING *`,
      [mapa_nombre, mapa_url, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMapa = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM mapas WHERE pk_id_mapa = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
