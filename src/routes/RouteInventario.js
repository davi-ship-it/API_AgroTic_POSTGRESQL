import{Router} from 'express'
import{ cargarImagen, RegistrarInventario, ListarInventario, ObtenerInventarioPorId, ActualizarInventario, EliminarInventario }from '../controllers/Inventario/InventarioController.js'

const router = Router() 

router.post('/registrar', cargarImagen,  RegistrarInventario)
router.get('/listar', ListarInventario)
router.get('/buscar/:id', ObtenerInventarioPorId)
router.put('/actualizar/:id', cargarImagen, ActualizarInventario)
router.delete('/eliminar/:id', EliminarInventario)




export default router;