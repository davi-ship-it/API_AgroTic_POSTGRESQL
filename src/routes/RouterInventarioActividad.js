import { Router } from 'express';
import {
  setInventarioActividad,
  getInventariosActividades,
  getInventarioActividadById,
  putInventarioActividad,
  deleteInventarioActividad
} from '../controllers/Inventario/inventarioxactividadesController.js';


const routerInventarioActividad = Router();

routerInventarioActividad.post('/registrar', setInventarioActividad);
routerInventarioActividad.get('/listar', getInventariosActividades);
routerInventarioActividad.get('/buscar/:id', getInventarioActividadById);
routerInventarioActividad.put('/actualizar/:id', putInventarioActividad);
routerInventarioActividad.delete('/eliminar/:id', deleteInventarioActividad);

export default routerInventarioActividad;
