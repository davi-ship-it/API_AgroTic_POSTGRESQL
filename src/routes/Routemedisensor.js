import { Router} from 'express';
import{
    registrarmedisensor,  obtenermedisensorPorId, actualizarmedisensor, eliminarmedisensor,
    listarmedisensor

}from '../controllers/medisensorController.js'

const router = Router();
router.post('/registrar', registrarmedisensor);
router.get('/listar', listarmedisensor);
router.get('/buscar/:id', obtenermedisensorPorId);
router.put('/actualizar/:id', actualizarmedisensor);
router.delete('/eliminar/:id', eliminarmedisensor);


export default router;