import { pool } from '../../database/conexion.js';

export const setTipoCultivo = async (req, res) => {
  const { tcu_nombre } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO tipo_cultivo (tcu_nombre) VALUES ($1) RETURNING *',
      [tcu_nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTiposCultivo = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tipo_cultivo');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTipoCultivoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM tipo_cultivo WHERE pk_id_tipo_cultivo = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const putTipoCultivo = async (req, res) => {
  const { id } = req.params;
  const { tcu_nombre } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tipo_cultivo
       SET tcu_nombre = $1
       WHERE pk_id_tipo_cultivo = $2 RETURNING *`,
      [tcu_nombre, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTipoCultivo = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM tipo_cultivo WHERE pk_id_tipo_cultivo = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
