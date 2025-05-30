
import { pool } from '../../database/conexion.js';


export const registrarCosecha = async (req, res) => {
const { cos_unidad_medida, cos_cantidad, cos_fecha, fk_id_cultivos_x_variedad } = req.body;

try {
    const query = `
    INSERT INTO cosechas (cos_unidad_medida, cos_cantidad, cos_fecha, fk_id_cultivos_x_variedad)
    VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [cos_unidad_medida, cos_cantidad, cos_fecha, fk_id_cultivos_x_variedad];
    const result = await pool.query(query, values);

    res.status(201).json({
    mensaje: 'Cosecha registrada exitosamente.',
    relacion: result.rows[0]
    });
} catch (error) {
    console.error('Error al registrar la cosecha:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
}
};

export const listarCosechas = async (req, res) => {
try {
    const query = 'SELECT * FROM cosechas';
    const result = await pool.query(query);

    res.status(200).json(result.rows);
}catch (error) {
    console.error('Error al listar cosecha:', error);
    return res.status(500).json({ message: 'Error al listar las cosechas', error: error.message });


}
}
export const obtenerCosechaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT * FROM cosechas WHERE pk_id_cosecha = $1';
        const result = await pool.query(sql, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cosecha no encontrada' });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener cosecha:', error);
        return res.status(500).json({ message: 'Error al obtener cosecha', error: error.message });
    }
}
export const actualizarCosecha = async (req, res) => {
    const { id } = req.params;
    const { cos_unidad_medida, cos_cantidad, cos_fecha, fk_id_cultivos_x_variedad } = req.body;
    try {
        const sql = `
        UPDATE cosechas
        SET cos_unidad_medida = $1, cos_cantidad = $2, cos_fecha = $3, fk_id_cultivos_x_variedad = $4
        WHERE pk_id_cosecha = $5
        RETURNING *;
        `;
        const result = await pool.query(sql, [cos_unidad_medida, cos_cantidad, cos_fecha, fk_id_cultivos_x_variedad, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cosecha no encontrada' });
        }
        return res.status(200).json({ message: 'Cosecha actualizada con éxito', cosecha: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar cosecha:', error);
        return res.status(500).json({ message: 'Error al actualizar cosecha', error: error.message });
    }
}
export const eliminarCosecha = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM cosechas WHERE pk_id_cosecha = $1 RETURNING *';
        const result = await pool.query(sql, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cosecha no encontrada' });
        }
        return res.status(200).json({ message: 'Cosecha eliminada con éxito', cosecha: result.rows[0] });
    } catch (error) {
        console.error('Error al eliminar cosecha:', error);
        return res.status(500).json({ message: 'Error al eliminar cosecha', error: error.message });
    }
}
