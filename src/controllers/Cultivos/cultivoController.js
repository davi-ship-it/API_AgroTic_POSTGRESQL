import { pool } from '../../database/conexion.js';

export const registrarCultivo = async (req, res) => {
try {
    const { cul_descripcion, cul_estado, cul_siembra } = req.body;

    const sql = `
    INSERT INTO cultivos (cul_descripcion, cul_estado, cul_siembra)
    VALUES ($1, $2, $3)
    RETURNING pk_id_cultivo
    `;

    const result = await pool.query(sql, [
    cul_descripcion,
    cul_estado,
    cul_siembra
    ]);

    const newId = result.rows[0]?.pk_id_cultivo;
    return res.status(201).json({ message: 'Cultivo creado con éxito', id: newId });

} catch (error) {
    console.error('Error al registrar cultivo:', error);
    return res.status(500).json({ message: 'Error al registrar cultivo', error: error.message });
}
};

export const listarCultivos = async (req, res) => {
try {
    const sql = 'SELECT * FROM cultivos';
    const result = await pool.query(sql);
    return res.status(200).json(result.rows);
} catch (error) {
    console.error('Error al listar cultivos:', error);
    return res.status(500).json({ message: 'Error al listar cultivos', error: error.message });
}
}

export const obtenerCultivoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'SELECT * FROM cultivos WHERE pk_id_cultivo = $1';
        const result = await pool.query(sql, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cultivo no encontrado' });
        }
        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener cultivo:', error);
        return res.status(500).json({ message: 'Error al obtener cultivo', error: error.message });
    }
}
export const actualizarCultivo = async (req, res) => {
    const { id } = req.params;
    const { cul_descripcion, cul_estado, cul_siembra } = req.body;
    try {
        const sql = `
        UPDATE cultivos
        SET cul_descripcion = $1, cul_estado = $2, cul_siembra = $3
        WHERE pk_id_cultivo = $4
        `;
        await pool.query(sql, [cul_descripcion, cul_estado, cul_siembra, id]);
        return res.status(200).json({ message: 'Cultivo actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar cultivo:', error);
        return res.status(500).json({ message: 'Error al actualizar cultivo', error: error.message });
    }
}
export const eliminarCultivo = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM cultivos WHERE pk_id_cultivo = $1';
        await pool.query(sql, [id]);
        return res.status(200).json({ message: 'Cultivo eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar cultivo:', error);
        return res.status(500).json({ message: 'Error al eliminar cultivo', error: error.message });
    }
}


export const getDataCultivoUnico = async (req, res) => {
  try {

    const { pk_id_cv_zona } = req.body;

    const sql = 'SELECT cv_z.pk_id_cv_zona, tpc.tpc_nombre, var.var_nombre, zon.zon_nombre, cul.cul_estado, cul.cul_siembra, cos.cos_cantidad FROM cultivos_variedad_x_zona cv_z JOIN zonas zon ON cv_z.fk_id_zona = zon.pk_id_zona JOIN cultivos_x_variedad cxv ON cv_z.fk_id_cultivos_x_variedad = cxv.pk_id_cultivos_x_variedad JOIN variedad var ON var.pk_id_variedad = cxv.fk_id_variedad JOIN tipo_cultivo tpc ON tpc.pk_id_tipo_cultivo = var.fk_id_tipo_cultivo JOIN cultivos cul ON cul.pk_id_cultivo = cxv.fk_id_cultivo JOIN cosechas cos ON cos.fk_id_cultivos_x_variedad = cxv.pk_id_cultivos_x_variedad WHERE cv_z.pk_id_cv_zona = $1;' ;

    const result = await pool.query(sql,[pk_id_cv_zona]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};