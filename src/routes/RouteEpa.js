import {Router} from 'express'
import{cargarImagen, RegistrarEpa, ListarEpa, ObtenerEpaPorId, ActualizarEpa, EliminarEpa

}from '../controllers/Fitosanitario/EpaController.js'


const router = Router()

router.post('/registrar', cargarImagen,  RegistrarEpa)
router.get('/listar', ListarEpa)
router.get('/buscar/:id', ObtenerEpaPorId)
router.put('/actualizar/:id', cargarImagen, ActualizarEpa)
router.delete('/eliminar/:id', EliminarEpa)


export default router;