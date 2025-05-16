import { Router } from 'express';
import {
  setVariedad,
  getVariedades,
  getVariedadById,
  putVariedad,
  deleteVariedad
} from '../controllers/Cultivos/variedadController.js';

const router_Variedad = Router();

router_Variedad.post('/registrar', setVariedad);
router_Variedad.get('/listar', getVariedades);
router_Variedad.get('/buscar/:id', getVariedadById);
router_Variedad.put('/actualizar/:id', putVariedad);
router_Variedad.delete('/eliminar/:id', deleteVariedad);

export default router_Variedad;
