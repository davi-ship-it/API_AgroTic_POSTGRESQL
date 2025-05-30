import { pool } from './../../database/conexion.js';


export const RegistrarTipoSensor = async (req,res) => {
    try{
        const {tps_nombre, tps_descripcion, tps_unidad_medida} = req.body;
        const query =`
        insert into tipo_sensor(
            tps_nombre,
            tps_descripcion,
            tps_unidad_medida
        ) values ($1, $2, $3)
        returning *`;

        const values = [
            tps_nombre,
            tps_descripcion,
            tps_unidad_medida
        ];
        const result = await pool.query(query, values);
        res.status(201).json({
            mensaje: 'Tipo de sensor registrado exitosamente.',
            tipo_sensor: result.rows[0]
        });
    }catch (error) {
        console.error('Error al registrar el tipo de sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }

}

export const ListarTipoSensor = async (req, res) => { 
    try {
        const query = 'SELECT * FROM tipo_sensor';
        const result = await pool.query(query);
        res.status(200).json(result.rows);

    }catch (error) {
        console.error('Error al listar los tipos de sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const ObtenerTipoSensorPorId = async (req, res) => {  
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM tipo_sensor WHERE pk_id_tipo_sensor = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tipo de sensor no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    }catch (error) {
        console.error('Error al obtener el tipo de sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const ActualizarTipoSensor = async (req, res) => {
    const { id } = req.params;
    const { tps_nombre, tps_descripcion, tps_unidad_medida } = req.body;

    try {
        const query = `
        update tipo_sensor
        set tps_nombre = $1,
            tps_descripcion = $2,
            tps_unidad_medida = $3
        where pk_id_tipo_sensor = $4
        returning *;`;

        const values = [
            tps_nombre,
            tps_descripcion,
            tps_unidad_medida,
            id
        ];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tipo de sensor no encontrado.' });
        }
        res.status(200).json({
            mensaje: 'Tipo de sensor actualizado exitosamente.',
            tipo_sensor: result.rows[0]
        });
    }catch (error) {
        console.error('Error al actualizar el tipo de sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const EliminarTipoSensor = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM tipo_sensor WHERE pk_id_tipo_sensor = $1';
        const result = await pool.query(query, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tipo de sensor no encontrado.' });
        }
        res.status(200).json({ mensaje: 'Tipo de sensor eliminado exitosamente.' });
    }catch (error) {
        console.error('Error al eliminar el tipo de sensor:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}