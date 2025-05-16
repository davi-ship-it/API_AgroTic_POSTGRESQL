import { Router } from 'express';
import { actualizarCosecha, eliminarCosecha, listarCosechas, obtenerCosechaPorId, registrarCosecha} from '../controllers/Cultivos/cosechaController.js';

const router = Router();

router.post('/registrar', registrarCosecha);
router.get ('/listar',listarCosechas );
router.get('/buscar/:id', obtenerCosechaPorId);
router.put('/actualizar/:id',actualizarCosecha );
router.delete('/eliminar/:id', eliminarCosecha);


export default router;