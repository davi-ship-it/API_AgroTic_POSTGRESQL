import { Router } from 'express';
import {
  setCultivoXepa,
  getCultivosXepa,
  getCultivoXepaById,
  putCultivoXepa,
  deleteCultivoXepa
} from '../controllers/Cultivos/cultivosXepaController.js';

const routerCultivosXepa = Router();

routerCultivosXepa.post('/registrar', setCultivoXepa);
routerCultivosXepa.get('/listar', getCultivosXepa);
routerCultivosXepa.get('/buscar/:id', getCultivoXepaById);
routerCultivosXepa.put('/actualizar/:id', putCultivoXepa);
routerCultivosXepa.delete('/eliminar/:id', deleteCultivoXepa);

export default routerCultivosXepa;
