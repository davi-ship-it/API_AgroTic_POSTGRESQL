import { Router } from 'express';
import {
  setMapa,
  getMapas,
  getMapaById,
  putMapa,
  deleteMapa
} from '../controllers/Cultivos/mapasController.js';

const routerMapas = Router();

routerMapas.post('/registrar', setMapa);
routerMapas.get('/listar', getMapas);
routerMapas.get('/buscar/:id', getMapaById);
routerMapas.put('/actualizar/:id', putMapa);
routerMapas.delete('/eliminar/:id', deleteMapa);

export default routerMapas;
