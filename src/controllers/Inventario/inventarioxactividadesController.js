import { pool } from '../../database/conexion.js';

export const setInventarioActividad = async (req, res) => {
  const { fk_id_inventario, fk_id_actividad, ixa_cantidad_usada } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inventario_x_actividades (fk_id_inventario, fk_id_actividad, ixa_cantidad_usada)
       VALUES ($1, $2, $3) RETURNING *`,
      [fk_id_inventario, fk_id_actividad, ixa_cantidad_usada]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 
// Obtener todas las relaciones
export const getInventariosActividades = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventario_x_actividades');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una relación por ID
export const getInventarioActividadById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM inventario_x_actividades WHERE pk_id_inventario_x_actividad = $1',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar relación por ID
export const putInventarioActividad = async (req, res) => {
  const { id } = req.params;
  const { fk_id_inventario, fk_id_actividad, ixa_cantidad_usada } = req.body;
  try {
    const result = await pool.query(
      `UPDATE inventario_x_actividades
       SET fk_id_inventario = $1, fk_id_actividad = $2, ixa_cantidad_usada = $3
       WHERE pk_id_inventario_x_actividad = $4 RETURNING *`,
      [fk_id_inventario, fk_id_actividad, ixa_cantidad_usada, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar relación por ID
export const deleteInventarioActividad = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM inventario_x_actividades WHERE pk_id_inventario_x_actividad = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
