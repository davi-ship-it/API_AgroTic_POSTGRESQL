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
export const cargarImagen = upload.single('inv_img_url');


export const RegistrarInventario = async (req,res) => {

    try{
        const { inv_nombre,inv_descripcion, inv_stock, inv_precio, inv_capacidad_unidad, ivn_fecha_vencimiento, fk_id_categoria, fk_id_bodega } = req.body;

        const inv_img_url = req.file.filename;

        const query =`
        insert into inventario(
            inv_nombre,inv_descripcion, inv_stock, inv_precio, inv_capacidad_unidad, ivn_fecha_vencimiento,inv_img_url, fk_id_categoria, fk_id_bodega
        ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        returning *;
        `;

        const values = [
            inv_nombre,
            inv_descripcion,
            inv_stock,
            inv_precio,
            inv_capacidad_unidad,
            ivn_fecha_vencimiento,
            inv_img_url,
            fk_id_categoria,
            fk_id_bodega
        ];

        const result = await pool.query(query, values);
        res.status(201).json({
            mensaje: 'Inventario registrado exitosamente.',
            inventario: result.rows[0]
        });
    }catch (error) {
        console.error('Error al registrar el inventario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}


export const ListarInventario = async (req, res) => { 
    try {
        const query = 'SELECT * FROM inventario';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    }
    catch (error) {
        console.error('Error al listar el inventario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const ObtenerInventarioPorId = async (req, res) => {  
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM inventario WHERE pk_id_inventario = $1';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inventario no encontrado.' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el inventario por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const ActualizarInventario = async (req, res) => {
    const { id } = req.params;
    const { inv_nombre, inv_descripcion, inv_stock, inv_precio, inv_capacidad_unidad, ivn_fecha_vencimiento, fk_id_categoria, fk_id_bodega } = req.body;

    try {
        const query = `
            UPDATE inventario
            SET inv_nombre = $1,
                inv_descripcion = $2,
                inv_stock = $3,
                inv_precio = $4,
                inv_capacidad_unidad = $5,
                ivn_fecha_vencimiento = $6,
                fk_id_categoria = $7,
                fk_id_bodega = $8
            WHERE pk_id_inventario = $9
            RETURNING *;
        `;

        const values = [
            inv_nombre,
            inv_descripcion,
            inv_stock,
            inv_precio,
            inv_capacidad_unidad,
            ivn_fecha_vencimiento,
            fk_id_categoria,
            fk_id_bodega,
            id
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inventario no encontrado.' });
        }

        res.status(200).json({
            mensaje: 'Inventario actualizado exitosamente.',
            inventario: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar el inventario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}

export const EliminarInventario = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM inventario WHERE pk_id_inventario = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Inventario no encontrado.' });
        }
        res.status(200).json({
            mensaje: 'Inventario eliminado exitosamente.',
            inventario: result.rows[0]
        });
    } catch (error) {
        console.error('Error al eliminar el inventario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}
