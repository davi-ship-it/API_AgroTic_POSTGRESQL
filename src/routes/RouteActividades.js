import { Router } from "express";
import{
    cargarImagen, listarActividades, registrarActividad, obtenerActividadPorId, actualizarActividad, eliminarActividad
}from '../controllers/actividadesController.js'

const router = Router();
router.post('/registrar', cargarImagen, registrarActividad);
router.get('/listar', listarActividades)
router.get('/buscar/:id', obtenerActividadPorId);
router.put('/actualizar/:id', cargarImagen, actualizarActividad);
router.delete('/eliminar/:id', eliminarActividad);



export default router;