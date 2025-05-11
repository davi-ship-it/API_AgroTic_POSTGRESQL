import { Router } from 'express';
import {
  getUsuarios,
  setUsuario,
  putUsuarios,
  deleteUsuarios,
  validarUsuario
} from '../controllers/UsuariosController.js';
import { verifyToken } from '../middlewares/VerifyToken.js';

const usuariosRouter = Router();

usuariosRouter.get('/Listar', verifyToken, getUsuarios);

usuariosRouter.post('/Registar/Free', setUsuario);

usuariosRouter.post('/Registrar',verifyToken, setUsuario);
usuariosRouter.post('/Login', validarUsuario);
usuariosRouter.put('/Actualizar', verifyToken, putUsuarios);
usuariosRouter.delete('/Eliminar', verifyToken, deleteUsuarios);

export default usuariosRouter;
