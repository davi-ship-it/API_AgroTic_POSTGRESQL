import { Router } from 'express';
import{ registrarCultivo, listarCultivos, obtenerCultivoPorId, actualizarCultivo, eliminarCultivo } from '../controllers/cultivoController.js'

const router = Router();

router.post('/registrar', registrarCultivo)
router.get('/listar', listarCultivos)
router.get('/obtener/:id', obtenerCultivoPorId)
router.put('/actualizar/:id', actualizarCultivo)
router.delete('/eliminar/:id', eliminarCultivo)

export default router;