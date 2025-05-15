import { pool } from '../database/conexion.js';

// Crear una zona
export const crearZona = async (req, res) => {
try {
    const { zon_nombre, zon_tipo_lote, zon_coor_x, zon_coor_y, fk_id_mapa } = req.body;

    const sql = `
    INSERT INTO zonas (zon_nombre, zon_tipo_lote, zon_coor_x, zon_coor_y, fk_id_mapa)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING pk_id_zona
    `;

    const result = await pool.query(sql, [zon_nombre, zon_tipo_lote, zon_coor_x, zon_coor_y, fk_id_mapa]);

    res.status(201).json({ message: 'Zona creada exitosamente', id: result.rows[0].pk_id_zona });
} catch (error) {
    console.error('Error al crear zona:', error);
    res.status(500).json({ error: 'Error al crear zona' });
}
};

//  Obtener todas las zonas
export const obtenerZonas = async (req, res) => {
    
try {
    const result = await pool.query('SELECT * FROM zonas');
    res.status(200).json(result.rows);
} catch (error) {
    console.error('Error al obtener zonas:', error);
    res.status(500).json({ error: 'Error al obtener zonas' });
}
};

//  Obtener una zona por ID
export const obtenerZonaPorId = async (req, res) => {
try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM zonas WHERE pk_id_zona = $1', [id]);

    if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Zona no encontrada' });
    }

    res.status(200).json(result.rows[0]);
} catch (error) {
    console.error('Error al obtener zona:', error);
    res.status(500).json({ error: 'Error al obtener zona' });
}
};

// Actualizar zona
export const actualizarZona = async (req, res) => {
try {
    const { id } = req.params;
    const { zon_nombre, zon_tipo_lote, zon_coor_x, zon_coor_y, fk_id_mapa } = req.body;

    const sql = `
    UPDATE zonas 
    SET zon_nombre = $1, zon_tipo_lote = $2, zon_coor_x = $3, zon_coor_y = $4, fk_id_mapa = $5
    WHERE pk_id_zona = $6
    `;

    await pool.query(sql, [zon_nombre, zon_tipo_lote, zon_coor_x, zon_coor_y, fk_id_mapa, id]);

    res.status(200).json({ message: 'Zona actualizada exitosamente' });
} catch (error) {
    console.error('Error al actualizar zona:', error);
    res.status(500).json({ error: 'Error al actualizar zona' });
}
};

//  Eliminar zona
export const eliminarZona = async (req, res) => {
try {
    const { id } = req.params;
    await pool.query('DELETE FROM zonas WHERE pk_id_zona = $1', [id]);
    res.status(200).json({ message: 'Zona eliminada exitosamente' });
} catch (error) {
    console.error('Error al eliminar zona:', error);
    res.status(500).json({ error: 'Error al eliminar zona' });
}
};
