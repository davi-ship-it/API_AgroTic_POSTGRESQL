import { pool } from '../../database/conexion.js';

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
