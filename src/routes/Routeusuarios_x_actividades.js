// routerUsuariosActividades.js
import { Router } from 'express';
import {
  setUsuariosActividades,
  getUsuariosActividades,
  getUsuariosActividadesById,
  putUsuariosActividades,
  deleteUsuariosActividades
} from '../controllers/Usuarios/usuarios_x_actividadesController.js';

const router_UsuariosActividades = Router();

router_UsuariosActividades.post('/registrar', setUsuariosActividades);

router_UsuariosActividades.get('/listar', getUsuariosActividades);

router_UsuariosActividades.get('/buscar/:id', getUsuariosActividadesById);

router_UsuariosActividades.put('/actualizar/:id', putUsuariosActividades);

router_UsuariosActividades.delete('/eliminar/:id', deleteUsuariosActividades);

export default router_UsuariosActividades;
