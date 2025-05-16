import { pool } from '../../database/conexion.js';

// Crear nueva asignación usuario-actividad
export const setUsuariosActividades = async (req, res) => {
  try {
    const { fk_id_usuario, fk_id_actividad, uxa_fecha_asignacion } = req.body;
    const sql = `
      INSERT INTO usuarios_x_actividades
        (fk_id_usuario, fk_id_actividad, uxa_fecha_asignacion)
      VALUES ($1, $2, $3)
      RETURNING pk_id_usuarios_x_actividades;
    `;
    const result = await pool.query(sql, [fk_id_usuario, fk_id_actividad, uxa_fecha_asignacion]);
    const newId = result.rows[0].pk_id_usuarios_x_actividades;
    res.status(201).json({ message: 'Asignación creada con éxito', id: newId });
  } catch (error) {
    console.error('Error creando asignación:', error);
    res.status(500).json({ message: 'Error al crear asignación', error: error.message });
  }
};

// Listar todas las asignaciones
export const getUsuariosActividades = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT pk_id_usuarios_x_actividades, fk_id_usuario, fk_id_actividad, uxa_fecha_asignacion FROM usuarios_x_actividades'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error obteniendo asignaciones:', error);
    res.status(500).json({ message: 'Error al obtener asignaciones', error: error.message });
  }
};

// Obtener asignación por ID
export const getUsuariosActividadesById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT pk_id_usuarios_x_actividades, fk_id_usuario, fk_id_actividad, uxa_fecha_asignacion FROM usuarios_x_actividades WHERE pk_id_usuarios_x_actividades = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Asignación no encontrada' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo asignación:', error);
    res.status(500).json({ message: 'Error al obtener asignación', error: error.message });
  }
};

// Actualizar asignación
export const putUsuariosActividades = async (req, res) => {
  try {
    const { id } = req.params;
    const { fk_id_usuario, fk_id_actividad, uxa_fecha_asignacion } = req.body;

    const fields = [];
    const params = [];
    let idx = 1;

    if (fk_id_usuario !== undefined) {
      fields.push(`fk_id_usuario = $${idx++}`);
      params.push(fk_id_usuario);
    }
    if (fk_id_actividad !== undefined) {
      fields.push(`fk_id_actividad = $${idx++}`);
      params.push(fk_id_actividad);
    }
    if (uxa_fecha_asignacion) {
      fields.push(`uxa_fecha_asignacion = $${idx++}`);
      params.push(uxa_fecha_asignacion);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    params.push(id);
    const sql = `
      UPDATE usuarios_x_actividades
      SET ${fields.join(', ')}
      WHERE pk_id_usuarios_x_actividades = $${idx}
    `;
    const result = await pool.query(sql, params);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Asignación actualizada con éxito' });
    } else {
      res.status(404).json({ message: 'Asignación no encontrada' });
    }
  } catch (error) {
    console.error('Error actualizando asignación:', error);
    res.status(500).json({ message: 'Error al actualizar asignación', error: error.message });
  }
};

// Eliminar asignación
export const deleteUsuariosActividades = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = 'DELETE FROM usuarios_x_actividades WHERE pk_id_usuarios_x_actividades = $1';
    const result = await pool.query(sql, [id]);

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Asignación eliminada con éxito' });
    } else {
      res.status(404).json({ message: 'Asignación no encontrada' });
    }
  } catch (error) {
    console.error('Error eliminando asignación:', error);
    res.status(500).json({ message: 'Error al eliminar asignación', error: error.message });
  }
};