import { pool } from './../../database/conexion.js';
import multer from 'multer';
import path from 'path';


// Configuración de Multer
const storage = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'src/public/img');
},
filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
}
});

const upload = multer({ storage });
export const cargarImagen = upload.single('sen_img');


export const RegistrarSensor = async (req,res) => {

    try{
        const{ sen_nombre, sen_coor_x, sen_coor_y, sen_rango_minimo, sen_rango_maximo, sen_estado, sen_fecha_instalacion, sen_fecha_ultimo_mantenimiento, fk_id_tipo_sensor, fk_id_zona} = req.body;
        const sen_img = req.file.filename;

        const query =`
        insert into sensor(
            sen_nombre,
            sen_coor_x,
            sen_coor_y,
            sen_rango_minimo,
            sen_rango_maximo,
            sen_estado,
            sen_img,
            sen_fecha_instalacion,
            sen_fecha_ultimo_mantenimiento,
            fk_id_tipo_sensor,
            fk_id_zona
        ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        returning *;`
        const values = [
            sen_nombre,
            sen_coor_x,
            sen_coor_y,
            sen_rango_minimo,
            sen_rango_maximo,
            sen_estado,
            sen_img,
            sen_fecha_instalacion,
            sen_fecha_ultimo_mantenimiento,
            fk_id_tipo_sensor,
            fk_id_zona
        ];
        const result = await pool.query(query, values);
        res.status(201).json({
            mensaje: 'Sensor registrado exitosamente.',
            sensor: result.rows[0]
        });

        console.log(result.rows)
    }catch (error) {
        console.error('Error al registrar el sensor:', error);
        res.status(500).json({ error: 'Error interno del servidoooor.' });
    }


}

export const ListarSensor = async (req, res) => { 
    try {
        const query = 'SELECT * FROM sensor';
        const result = await pool.query(query);
        res.status(200).json(result.rows);

    }catch (error) {
        console.error('Error al listar los sensores:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }

}


export const ObtenerSensorPorId = async (req, res) => {  
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM sensor WHERE pk_id_sensor = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const ActualizarSensor = async (req, res) => {
    const { id } = req.params;
    const { sen_nombre, sen_coor_x, sen_coor_y, sen_rango_minimo, sen_rango_maximo, sen_estado, sen_fecha_instalacion, sen_fecha_ultimo_mantenimiento, fk_id_tipo_sensor, fk_id_zona} = req.body;
    const sen_img = req.file.filename;

    try {
        const query = `
        UPDATE sensor
        SET 
            sen_nombre = $1,
            sen_coor_x = $2,
            sen_coor_y = $3,
            sen_rango_minimo = $4,
            sen_rango_maximo = $5,
            sen_estado = $6,
            sen_img = $7,
            sen_fecha_instalacion = $8,
            sen_fecha_ultimo_mantenimiento = $9,
            fk_id_tipo_sensor = $10,
            fk_id_zona = $11
        WHERE pk_id_sensor = $12
        RETURNING *;`;

        const values = [
            sen_nombre,
            sen_coor_x,
            sen_coor_y,
            sen_rango_minimo,
            sen_rango_maximo,
            sen_estado,
            sen_img,
            sen_fecha_instalacion,
            sen_fecha_ultimo_mantenimiento,
            fk_id_tipo_sensor,
            fk_id_zona,
            id
        ];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado.' });
        }
        res.status(200).json({
            mensaje: 'Sensor actualizado exitosamente.',
            sensor: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar el sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const EliminarSensor = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM sensor WHERE pk_id_sensor = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sensor no encontrado.' });
        }
        res.status(200).json({
            mensaje: 'Sensor eliminado exitosamente.',
            sensor: result.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar el sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}