import { pool } from '../../database/conexion.js';
//holaa

export const getFinanzasCultivo = async (req, res) => {
  try {
    // Desestructuramos los filtros de la petición (ahora todos opcionales)
    const { pk_id_cv_zona } = req.body;

    // Arrays para cláusulas y valores
   
    // Consulta completa
     const sql = `
   SELECT


  ixa.pk_id_inventario_x_actividad,
  cv_z.pk_id_cv_zona,
  uxa.pk_id_usuarios_x_actividades,
  act.pk_id_actividad,
  usu.pk_id_usuario,
  act.act_nombre, 
  usu.usu_nombres,
  usu.usu_dni,
  zon.zon_nombre,
  zon.zon_tipo_lote,
  act.act_fecha_inicio,
  act.act_fecha_fin,
  var.var_nombre,
  tpc.tpc_nombre,

  inv.inv_nombre,
  cat.cat_nombre,
  ixa.ixa_cantidad_usada    AS cantidad_usada,
  inv.inv_precio,
  inv.inv_capacidad_unidad,

  cul.cul_siembra,
  cos.cos_fecha             AS fecha_cosecha,
  cos.cos_cantidad          AS cantidad_cosechada,
  cos.cos_unidad_medida,

  ven.ven_precio_kilo,
  ven.ven_venta_total,
  ven.ven_fecha             AS fecha_venta,
  ven.ven_cantidad          AS cantidad_vendida


FROM usuarios_x_actividades uxa
  JOIN usuarios usu
    ON usu.pk_id_usuario = uxa.fk_id_usuario
  JOIN actividades act
    ON act.pk_id_actividad = uxa.fk_id_actividad
	

  
  JOIN cultivos_variedad_x_zona cv_z
    ON cv_z.pk_id_cv_zona = act.fk_id_cultivo_variedad_x_zona

  JOIN zonas zon
    ON zon.pk_id_zona = cv_z.fk_id_zona

	
  JOIN cultivos_x_variedad cxv
    ON cxv.pk_id_cultivos_x_variedad = cv_z.fk_id_cultivos_x_variedad
  JOIN cultivos cul
    ON cul.pk_id_cultivo = cxv.fk_id_cultivo

  JOIN variedad var 
    ON var.pk_id_variedad = cxv.fk_id_variedad
  JOIN tipo_cultivo tpc 
    ON tpc.pk_id_tipo_cultivo = var.fk_id_tipo_cultivo
  
  
  JOIN inventario_x_actividades ixa
    ON ixa.fk_id_actividad = act.pk_id_actividad
  JOIN inventario inv
    ON inv.pk_id_inventario = ixa.fk_id_inventario
  JOIN categoria cat
    ON cat.pk_id_categoria = inv.fk_id_categoria

 
  LEFT JOIN cosechas cos
    ON cos.fk_id_cultivos_x_variedad = cxv.pk_id_cultivos_x_variedad
  LEFT JOIN venta ven
    ON ven.fk_id_cosecha = cos.pk_id_cosecha
    WHERE 
    cv_z.pk_id_cv_zona = $1

    ; `;

    // Ejecutamos la consulta
    const result = await pool.query(sql, [pk_id_cv_zona]);


   let calculo = calcularRentabilidad(result.rows)


    return res.status(200).json(calculo);

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};
/*
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
  cv_z.pk_id_cv_zona,
  usu.usu_nombres,
  usu.usu_dni,
  zon.zon_nombre,
  tpc.tpc_nombre,
  var.var_nombre
FROM usuarios_x_actividades uxa
INNER JOIN usuarios usu 
  ON uxa.fk_id_usuario = usu.pk_id_usuario
INNER JOIN actividades act 
  ON uxa.fk_id_actividad = act.pk_id_actividad
INNER JOIN cultivos_variedad_x_zona cv_z 
  ON act.fk_id_cultivo_variedad_x_zona = cv_z.pk_id_cv_zona
INNER JOIN zonas zon 
  ON cv_z.fk_id_zona = zon.pk_id_zona
INNER JOIN cultivos_x_variedad cxv 
  ON cv_z.fk_id_cultivos_x_variedad = cxv.pk_id_cultivos_x_variedad
INNER JOIN variedad var 
  ON cxv.fk_id_variedad = var.pk_id_variedad
INNER JOIN tipo_cultivo tpc 
  ON var.fk_id_tipo_cultivo = tpc.pk_id_tipo_cultivo
    ${whereSQL}

    ; `;

    // Ejecutamos la consulta
    const result = await pool.query(sql, values);




    return res.status(200).json(result.rows);

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

*/

 function calcularRentabilidad(finanzas) {
  // 1) Calculamos por ítem, igual que antes
 
 
 
 
 
  const detallado = finanzas.map(item => {
    
    const cantidadUsada     = parseFloat(item.cantidad_usada);
    const invPrecio         = parseFloat(item.inv_precio);
    const capacidadUnidad   = parseFloat(item.inv_capacidad_unidad);
    const VentaTotal       = parseFloat(item.ven_venta_total);


    const precioPorUnidad   = invPrecio / capacidadUnidad;
    const costoConsumido    = cantidadUsada * precioPorUnidad;

    return {
      status: item.cat_nombre  === 'Herramientas' ? false : true ,
      costoConsumido,
      VentaTotal
    };
  });

  // 2) Reducimos a un solo objeto con las tres sumas
  const totales = detallado.reduce((acc, item) => {
    // sólo sumamos los válidos (status true)
    if (item.status) {
      acc.totalCostoConsumido += item.costoConsumido;
    }
    return acc;
  }, 
  
  {
    totalCostoConsumido: 0,
 
  });


  let ganancias = detallado[0].VentaTotal  - totales.totalCostoConsumido  

 // console.log(detallado[2])
  console.log(detallado)

  let DataCalculos = {
    totalCostoConsumido: totales.totalCostoConsumido.toFixed(2),
    VentaTotal: detallado[0].VentaTotal,
    ganancias,
  };

  

  return { Trazabilidad_Finanzas: finanzas, DataCalculos};
}
