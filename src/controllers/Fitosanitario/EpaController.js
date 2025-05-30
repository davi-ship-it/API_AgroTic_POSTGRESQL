import { pool } from './../../database/conexion.js';
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
export const cargarImagen = upload.single('epa_img_url');


export const RegistrarEpa = async (req,res) => {

    try{
        const { epa_nombre, epa_descripcion, epa_tipo } = req.body;

        const epa_img_url = req.file.filename;

        const query =`
        insert into epa(
            epa_nombre,
            epa_descripcion,
            epa_img_url,
            epa_tipo
        ) values ($1, $2, $3, $4)
        returning *;
        `;

        const values = [
            epa_nombre,
            epa_descripcion,
            epa_img_url,
            epa_tipo
        ];

        const result = await pool.query(query, values);
        res.status(201).json({
            mensaje: 'Epa registrado exitosamente.',
            epa: result.rows[0]
        });
    }catch (error) {
        console.error('Error al registrar el epa:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const ListarEpa = async (req, res) => { 
    try {
        const query = 'SELECT * FROM epa';
        const result = await pool.query(query);
        res.status(200).json(result.rows);

}catch (error) {
    console.error('Error al listar los epa:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
}


export const ObtenerEpaPorId = async (req, res) => {  
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM epa WHERE pk_id_epa = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Epa no encontrado.' });
        }
        res.status(200).json(result.rows[0]);


}catch (error) {
    console.error('Error al obtener el epa:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
}

export const ActualizarEpa = async (req, res) => {
const { id } = req.params;
const { epa_nombre, epa_descripcion, epa_tipo } = req.body;
const epa_img_url = req.file ? req.file.filename : null;

try {
    let query;
    let values;

    if (epa_img_url) {
      // Si se incluye imagen, se actualiza también
    query = `
        UPDATE epa
        SET epa_nombre = $1,
            epa_descripcion = $2,
            epa_tipo = $3,
            epa_img_url = $4
        WHERE pk_id_epa = $5
        RETURNING *;
    `;
    values = [epa_nombre, epa_descripcion, epa_tipo, epa_img_url, id];
    } else {
      // Si no se incluye imagen, se actualizan solo los demás campos
    query = `
        UPDATE epa
        SET epa_nombre = $1,
            epa_descripcion = $2,
            epa_tipo = $3
        WHERE pk_id_epa = $4
        RETURNING *;
    `;
    values = [epa_nombre, epa_descripcion, epa_tipo, id];
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Epa no encontrado.' });
    }

    res.status(200).json({
    mensaje: 'Epa actualizado exitosamente.',
    epa: result.rows[0]
    });
} catch (error) {
    console.error('Error al actualizar el epa:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
};

export const EliminarEpa = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM epa WHERE pk_id_epa = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Epa no encontrado.' });
        }
        res.status(200).json({
            mensaje: 'Epa eliminado exitosamente.',
            epa: result.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar el epa:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}