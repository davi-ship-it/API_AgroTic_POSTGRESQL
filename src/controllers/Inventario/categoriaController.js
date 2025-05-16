import { pool } from '../../database/conexion.js';

// Crear nueva categoría
export const setCategoria = async (req, res) => {
  try {
    const { cat_nombre, fk_id_tipo_unidad } = req.body;
    const sql = `
      INSERT INTO categoria (cat_nombre, fk_id_tipo_unidad)
      VALUES ($1, $2)
      RETURNING pk_id_categoria;
    `;
    const result = await pool.query(sql, [cat_nombre, fk_id_tipo_unidad]);
    const newId = result.rows[0].pk_id_categoria;
    res.status(201).json({ message: 'Categoría creada con éxito', id: newId });
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ message: 'Error al crear categoría', error: error.message });
  }
};

// Listar todas las categorías
export const getCategorias = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT pk_id_categoria, cat_nombre, fk_id_tipo_unidad FROM categoria'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
  }
};

// Obtener categoría por ID
export const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT pk_id_categoria, cat_nombre, fk_id_tipo_unidad FROM categoria WHERE pk_id_categoria = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({ message: 'Error al obtener categoría', error: error.message });
  }
};

// Actualizar categoría
export const putCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { cat_nombre, fk_id_tipo_unidad } = req.body;

    const fields = [];
    const params = [];
    let idx = 1;

    if (cat_nombre) {
      fields.push(`cat_nombre = $${idx++}`);
      params.push(cat_nombre);
    }
    if (fk_id_tipo_unidad !== undefined) {
      fields.push(`fk_id_tipo_unidad = $${idx++}`);
      params.push(fk_id_tipo_unidad);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    params.push(id);
    const sql = `
      UPDATE categoria
      SET ${fields.join(', ')}
      WHERE pk_id_categoria = $${idx}
    `;
    const result = await pool.query(sql, params);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Categoría actualizada con éxito' });
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ message: 'Error al actualizar categoría', error: error.message });
  }
};

// Eliminar categoría
export const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM categoria WHERE pk_id_categoria = $1';
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Categoría eliminada con éxito' });
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ message: 'Error al eliminar categoría', error: error.message });
  }
};