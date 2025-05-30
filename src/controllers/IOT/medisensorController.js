import {pool} from '../../database/conexion.js'


export const registrarmedisensor= async (req, res) => {
    try{
        const {med_valor, med_fecha_medicion, fk_id_sensor} = req.body;
        const query = 'INSERT INTO medicion_sensor (med_valor, med_fecha_medicion, fk_id_sensor) VALUES ($1, $2, $3) RETURNING *';

        const result = await pool.query(query, [med_valor, med_fecha_medicion, fk_id_sensor]);
        res.status(201).json({
            mensaje: 'Medición registrada exitosamente.',
            medicion: result.rows[0]
        });
    }catch (error) {
        console.error('Error al registrar la medición:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
export const listarmedisensor = async (req, res) => {
    try {
        const query = 'SELECT * FROM medicion_sensor';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error al listar las mediciones:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
export const obtenermedisensorPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM medicion_sensor WHERE pk_id_medicion = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Medición no encontrada.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la medición:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
export const actualizarmedisensor = async (req, res) => {
    const { id } = req.params;
    const { med_valor, med_fecha_medicion, fk_id_sensor } = req.body;

    try {
        const query = `
        UPDATE medicion_sensor
        SET med_valor = $1, med_fecha_medicion = $2, fk_id_sensor = $3
        WHERE pk_id_medicion = $4
        RETURNING *;
        `;

        const result = await pool.query(query, [med_valor, med_fecha_medicion, fk_id_sensor, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Medición no encontrada.' });
        }

        res.status(200).json({
            mensaje: 'Medición actualizada exitosamente.',
            medicion: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar la medición:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
export const eliminarmedisensor = async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM medicion_sensor WHERE pk_id_medicion = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Medición no encontrada.' });
        }

        res.status(200).json({
            mensaje: 'Medición eliminada exitosamente.',
            medicion: result.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar la medición:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}