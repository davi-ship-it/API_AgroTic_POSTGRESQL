import { Router } from 'express';
import {
  setTipoCultivo,
  getTiposCultivo,
  getTipoCultivoById,
  putTipoCultivo,
  deleteTipoCultivo
} from '../controllers/Cultivos/tipoCultivoController.js';

const routerTipoCultivo = Router();

routerTipoCultivo.post('/registrar', setTipoCultivo);
routerTipoCultivo.get('/listar', getTiposCultivo);
routerTipoCultivo.get('/buscar/:id', getTipoCultivoById);
routerTipoCultivo.put('/actualizar/:id', putTipoCultivo);
routerTipoCultivo.delete('/eliminar/:id', deleteTipoCultivo);

export default routerTipoCultivo;
