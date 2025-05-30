import { Router } from 'express';
import {
  setBodega,
  getBodegas,
  getBodegaById,
  putBodega,
  deleteBodega
} from '../controllers/Inventario/bodegaController.js';

const routerBodega = Router();

routerBodega.post('/registrar', setBodega);
routerBodega.get('/listar', getBodegas);
routerBodega.get('/buscar/:id', getBodegaById);
routerBodega.put('/actualizar/:id', putBodega);
routerBodega.delete('/eliminar/:id', deleteBodega);

export default routerBodega;

