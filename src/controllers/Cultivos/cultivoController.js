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



/*export const getDataFiltroCultivo = async (req, res) => {
  try {

const { var_nombre, zon_nombre, cul_estado } = req.body;
const conditions = [];
const values     = [];

if (var_nombre) {
  values.push(`%${var_nombre}%`);
  conditions.push(`tpc.tpc_nombre ILIKE $${values.length}`);
}
if (zon_nombre) {
  values.push(`%${zon_nombre}%`);
  conditions.push(`zon.zon_nombre ILIKE $${values.length}`);
}
if (cul_estado !== undefined) {
  values.push(cul_estado);
  conditions.push(`cul.cul_estado = $${values.length}`);
}

let sql = `
  SELECT
    cv_z.pk_id_cv_zona,
    tpc.tpc_nombre,
    var.var_nombre,
    zon.zon_nombre,
    cul.cul_estado,
    cul.cul_siembra,
    cos.cos_cantidad
  FROM cultivos_variedad_x_zona cv_z
  JOIN zonas zon ON cv_z.fk_id_zona = zon.pk_id_zona
  JOIN cultivos_x_variedad cxv ON cv_z.fk_id_cultivos_x_variedad = cxv.pk_id_cultivos_x_variedad
  JOIN variedad var ON var.pk_id_variedad = cxv.fk_id_variedad
  JOIN tipo_cultivo tpc ON tpc.pk_id_tipo_cultivo = var.fk_id_tipo_cultivo
  JOIN cultivos cul ON cul.pk_id_cultivo = cxv.fk_id_cultivo
  JOIN cosechas cos ON cos.fk_id_cultivos_x_variedad = cxv.pk_id_cultivos_x_variedad
`;

if (conditions.length > 0) {
  sql += ' WHERE ' + conditions.join(' AND ');
}

  const result = await pool.query(sql, values);
return res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};*/


export const getDataFiltroCultivo = async (req, res) => {
  try {
    // Desestructuramos los filtros de la petición (todos opcionales)
    const { siembra_inicio, siembra_fin, tpc_nombre, zon_nombre, cul_estado } = req.body;

    // Arrays para cláusulas y valores
    const whereClauses = [];
    const values = [];
    let idx = 1;

    // Filtro por rango de fechas de siembra (en cultivos)
    if (siembra_inicio && siembra_fin) {
      whereClauses.push(`cul.cul_siembra BETWEEN $${idx} AND $${idx + 1}`);
      values.push(siembra_inicio, siembra_fin);
      idx += 2;
    } else if (siembra_inicio) {
      whereClauses.push(`cul.cul_siembra >= $${idx}`);
      values.push(siembra_inicio);
      idx++;
    } else if (siembra_fin) {
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

    // Filtro por zona
    if (zon_nombre) {
      whereClauses.push(`TRIM(zon.zon_nombre) = $${idx}`);
      values.push(zon_nombre.trim());
      idx++;
    }

    // Filtro por estado de cultivo
    if (cul_estado) {
      whereClauses.push(`cul.cul_estado = $${idx}`);
      values.push(cul_estado);
      idx++;
    }

    // Construimos la parte WHERE (si hay alguna cláusula)
    const whereSQL = whereClauses.length
      ? 'WHERE ' + whereClauses.join(' AND ')
      : '';

    // Consulta completa: arrancamos en cultivos y vamos armando las relaciones
    const sql = `
      SELECT
        cul.pk_id_cultivo,
        cul.cul_siembra,
        cul.cul_estado,
        tpc.tpc_nombre    AS tipo_cultivo,
        var.var_nombre   AS variedad,
        zon.zon_nombre   AS zona,
        cv_z.pk_id_cv_zona

      FROM cultivos cul

      INNER JOIN cultivos_x_variedad cxv 
        ON cul.pk_id_cultivo = cxv.fk_id_cultivo

      INNER JOIN variedad var
        ON cxv.fk_id_variedad = var.pk_id_variedad

      INNER JOIN tipo_cultivo tpc
        ON var.fk_id_tipo_cultivo = tpc.pk_id_tipo_cultivo

      INNER JOIN cultivos_variedad_x_zona cv_z
        ON cxv.pk_id_cultivos_x_variedad = cv_z.fk_id_cultivos_x_variedad

      INNER JOIN zonas zon
        ON cv_z.fk_id_zona = zon.pk_id_zona

      ${whereSQL};
    `;

    // Ejecutamos la consulta
    const result = await pool.query(sql, values);c
    return res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error obteniendo cultivos:', error);
    return res.status(500).json({ message: 'Error al obtener cultivos', error: error.message });
  }
};
