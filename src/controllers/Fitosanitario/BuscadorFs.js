import { pool } from '../../database/conexion.js';
//holaa
export const setFiltroFinanzas = async (req, res) => {
  try {
    // Desestructuramos los filtros de la petición (ahora todos opcionales)
    const { usu_dni, siembra_inicio, siembra_fin, tpc_nombre } = req.body;

    // Arrays para cláusulas y valores
    const whereClauses = [];
    const values = [];
    let idx = 1;

    // Filtro por DNI (parcial)
    if (usu_dni) {
      whereClauses.push(`usu.usu_dni::TEXT LIKE $${idx}`);
      values.push(`%${usu_dni}%`);
      idx++;
    }

    // Filtro por rango de fechas
    if (siembra_inicio && siembra_fin) {
      // Si envían ambos, usamos BETWEEN
      whereClauses.push(`cul.cul_siembra BETWEEN $${idx} AND $${idx + 1}`);
      values.push(siembra_inicio, siembra_fin);
      idx += 2;
    } else if (siembra_inicio) {
      // Solo fecha mínima
      whereClauses.push(`cul.cul_siembra >= $${idx}`);
      values.push(siembra_inicio);
      idx++;
    } else if (siembra_fin) {
      // Solo fecha máxima
      whereClauses.push(`cul.cul_siembra <= $${idx}`);
      values.push(siembra_fin);
      idx++;
    }

    // Filtro por tipo de cultivo
    if (tpc_nombre) {
      whereClauses.push(`TRIM(tpc.tpc_nombre) = $${idx}`);
      values.push(tpc_nombre.trim());
      idx++;
    }

    // Construimos la parte WHERE (si hay alguna cláusula)
    const whereSQL = whereClauses.length
      ? 'WHERE ' + whereClauses.join(' AND ')
      : '';

    // Consulta completa
    const sql = `
      SELECT 
        usu.usu_nombres, 
        usu.usu_dni, 
        cul.cul_siembra, 
        tpc.tpc_nombre
      FROM usuarios_x_actividades uxa
        JOIN usuarios usu 
          ON usu.pk_id_usuario = uxa.fk_id_usuario
        JOIN actividades act 
          ON act.pk_id_actividad = uxa.fk_id_actividad
        JOIN zonas zon 
          ON act.fk_id_zona = zon.pk_id_zona
        JOIN cultivos_variedad_x_zona cv_z 
          ON cv_z.fk_id_zona = zon.pk_id_zona
        JOIN cultivos_x_variedad cxv 
          ON cv_z.fk_id_cultivos_x_variedad = cxv.pk_id_cultivos_x_variedad
        JOIN variedad var 
          ON var.pk_id_variedad = cxv.fk_id_variedad
        JOIN tipo_cultivo tpc 
          ON tpc.pk_id_tipo_cultivo = var.fk_id_tipo_cultivo
        JOIN cultivos cul 
          ON cul.pk_id_cultivo = cxv.fk_id_cultivo
      ${whereSQL}
      ORDER BY cul.cul_siembra DESC
    `;

    // Ejecutamos la consulta
    const result = await pool.query(sql, values);
    return res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};
