import { pool } from '../../database/conexion.js';

// Crear nueva variedad
export const setVariedad = async (req, res) => {
  try {
    const { var_nombre, fk_id_tipo_cultivo } = req.body;
    const sql = `
      INSERT INTO variedad (var_nombre, fk_id_tipo_cultivo)
      VALUES ($1, $2)
      RETURNING pk_id_variedad;
    `;
    const result = await pool.query(sql, [var_nombre, fk_id_tipo_cultivo]);
    const newId = result.rows[0].pk_id_variedad;
    res.status(201).json({ message: 'Variedad creada con éxito', id: newId });
  } catch (error) {
    console.error('Error creando variedad:', error);
    res.status(500).json({ message: 'Error al crear variedad', error: error.message });
  }
};

// Listar todas las variedades
export const getVariedades = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT pk_id_variedad, var_nombre, fk_id_tipo_cultivo FROM variedad'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error obteniendo variedades:', error);
    res.status(500).json({ message: 'Error al obtener variedades', error: error.message });
  }
};

// Obtener variedad por ID
export const getVariedadById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT pk_id_variedad, var_nombre, fk_id_tipo_cultivo FROM variedad WHERE pk_id_variedad = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Variedad no encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo variedad:', error);
    res.status(500).json({ message: 'Error al obtener variedad', error: error.message });
  }
};

// Actualizar variedad
export const putVariedad = async (req, res) => {
  try {
    const { id } = req.params;
    const { var_nombre, fk_id_tipo_cultivo } = req.body;

    const fields = [];
    const params = [];
    let idx = 1;

    if (var_nombre) {
      fields.push(`var_nombre = $${idx++}`);
      params.push(var_nombre);
    }
    if (fk_id_tipo_cultivo !== undefined) {
      fields.push(`fk_id_tipo_cultivo = $${idx++}`);
      params.push(fk_id_tipo_cultivo);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    params.push(id);
    const sql = `
      UPDATE variedad
      SET ${fields.join(', ')}
      WHERE pk_id_variedad = $${idx}
    `;
    const result = await pool.query(sql, params);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Variedad actualizada con éxito' });
    } else {
      res.status(404).json({ message: 'Variedad no encontrada' });
    }
  } catch (error) {
    console.error('Error actualizando variedad:', error);
    res.status(500).json({ message: 'Error al actualizar variedad', error: error.message });
  }
};

// Eliminar variedad
export const deleteVariedad = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM variedad WHERE pk_id_variedad = $1';
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Variedad eliminada con éxito' });
    } else {
      res.status(404).json({ message: 'Variedad no encontrada' });
    }
  } catch (error) {
    console.error('Error eliminando variedad:', error);
    res.status(500).json({ message: 'Error al eliminar variedad', error: error.message });
  }
};