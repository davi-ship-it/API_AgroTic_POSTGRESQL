import { Router } from 'express';
import {
  createVenta,
  getVentas,
  getVentaById,
  updateVenta,
  deleteVenta
} from '../controllers/Finanzas/VentaController.js';

const routerVenta = Router();

routerVenta.post('/registrar', createVenta);
routerVenta.get('/listar', getVentas);
routerVenta.get('/buscar/:id', getVentaById);
routerVenta.put('/actualizar/:id', updateVenta);
routerVenta.delete('/eliminar/:id', deleteVenta);

export default routerVenta;

