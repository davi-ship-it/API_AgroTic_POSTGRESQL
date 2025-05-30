import { Router } from 'express';
import {
  getUsuarios,
  setUsuario,
  putUsuarios,
  deleteUsuarios,
  validarUsuario
} from '../controllers/Usuarios/UsuariosController.js';
import { verifyToken } from '../middlewares/VerifyToken.js';

import { requestRoleChange, acceptRoleChange } from '../controllers/Usuarios/Gestion_Roles/Rol.js';
//hola
const usuariosRouter = Router();

usuariosRouter.get('/Listar', verifyToken, getUsuarios);

usuariosRouter.post('/Registrar/Free', setUsuario);

usuariosRouter.post('/Registrar',verifyToken, setUsuario);
usuariosRouter.post('/Login', validarUsuario);
usuariosRouter.put('/Actualizar', verifyToken, putUsuarios);
usuariosRouter.delete('/Eliminar', verifyToken, deleteUsuarios);



/* Manejo de roles*/ 
usuariosRouter.post('/Roles/Solicitud', requestRoleChange);
usuariosRouter.get('/Roles/Respuesta', acceptRoleChange);

export default usuariosRouter;
