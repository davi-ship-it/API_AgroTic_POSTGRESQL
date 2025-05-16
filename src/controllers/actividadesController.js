

import { pool } from '../database/conexion.js';
import multer from 'multer';
import path from 'path';


// Configuración de Multer
const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'src/public/img');
},
filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // ejemplo: 1715724912123.jpg
}
});

const upload = multer({ storage });
export const cargarImagen = upload.single('act_img_url');

// Registrar actividad
export const registrarActividad = async (req, res) => {
const { act_nombre, act_descripcion, act_fecha_inicio, act_fecha_fin, act_estado, fk_id_zona } = req.body;

  // Validar que venga una imagen
if (!req.file) {
    return res.status(400).json({ error: 'La imagen (act_img_url) es obligatoria.' });
}

const act_img_url = req.file.filename;

try {
    const query = `
    INSERT INTO actividades (
        act_nombre, act_descripcion, act_fecha_inicio, act_fecha_fin, 
        act_estado, act_img_url, fk_id_zona
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
    act_nombre,
    act_descripcion,
    act_fecha_inicio,
    act_fecha_fin,
    act_estado,
    act_img_url,
    fk_id_zona
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
    mensaje: 'Actividad registrada exitosamente.',
    actividad: result.rows[0]
    });
} catch (error) {
    console.error('Error al registrar la actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
};

export const listarActividades = async (req, res) => {
try {
    const query = 'SELECT * FROM actividades';
    const result = await pool.query(query);

    res.status(200).json(result.rows);
} catch (error) {
    console.error('Error al listar actividades:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
}
export const obtenerActividadPorId = async (req, res) => {
const { id } = req.params;
try {
    const query = 'SELECT * FROM actividades WHERE pk_id_actividad = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Actividad no encontrada.' });
    }

    res.status(200).json(result.rows[0]);
} catch (error) {
    console.error('Error al obtener la actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
}
export const actualizarActividad = async (req, res) => {
const { id } = req.params;
const {
    act_nombre,
    act_descripcion,
    act_fecha_inicio,
    act_fecha_fin,
    act_estado,
    fk_id_zona
} = req.body;

  // Extraer imagen si fue subida
const act_img_url = req.file ? req.file.filename : null;

try {
    let query = `
    UPDATE actividades
    SET act_nombre = $1,
        act_descripcion = $2,
        act_fecha_inicio = $3,
        act_fecha_fin = $4,
        act_estado = $5,
        fk_id_zona = $6
    `;

    let values = [
    act_nombre,
    act_descripcion,
    act_fecha_inicio,
    act_fecha_fin,
    act_estado,
    fk_id_zona
    ];

    // Si hay imagen, añadirla al query
    if (act_img_url) {
      query += `, act_img_url = $7 WHERE pk_id_actividad = $8 RETURNING *;`;
    values.push(act_img_url, id);
    } else {
      query += ` WHERE pk_id_actividad = $7 RETURNING *;`;
    values.push(id);
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Actividad no encontrada.' });
    }

    res.status(200).json({
    mensaje: 'Actividad actualizada exitosamente.',
    actividad: result.rows[0]
    });
} catch (error) {
    console.error('Error al actualizar la actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
};


export const eliminarActividad = async (req, res) => {
const { id } = req.params;
try {
    const query = 'DELETE FROM actividades WHERE pk_id_actividad = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Actividad no encontrada.' });
    }
    res.status(200).json({
    mensaje: 'Actividad eliminada exitosamente.',
    actividad: result.rows[0]
    });
}
catch (error) {
    console.error('Error al eliminar la actividad:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
}

