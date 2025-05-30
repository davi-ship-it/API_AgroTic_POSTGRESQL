import { Router } from 'express';
import{ registrarCultivo, listarCultivos, actualizarCultivo, eliminarCultivo, getDataFiltroCultivo} from '../controllers/Cultivos/cultivoController.js'

const router = Router();

router.post('/registrar', registrarCultivo)
router.get('/listar', listarCultivos)
router.get('/FiltroCultivo', getDataFiltroCultivo)
router.put('/actualizar/:id', actualizarCultivo)
router.delete('/eliminar/:id', eliminarCultivo)

export default router;