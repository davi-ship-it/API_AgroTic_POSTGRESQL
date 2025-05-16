
// routerCategoria.js
import { Router } from 'express';
import {
  setCategoria,
  getCategorias,
  getCategoriaById,
  putCategoria,
  deleteCategoria
} from '../controllers/Inventario/categoriaController.js';

const routerCategoria = Router();

// Crear una nueva categoría
routerCategoria.post('/registrar', setCategoria);

// Listar todas las categorías
routerCategoria.get('/listar', getCategorias);

// Obtener categoría por ID
routerCategoria.get('/buscar/:id', getCategoriaById);

// Actualizar categoría por ID
routerCategoria.put('/actualizar/:id', putCategoria);

// Eliminar categoría por ID
routerCategoria.delete('/eliminar/:id', deleteCategoria);

export default routerCategoria;