import {Router} from 'express'
import{ cargarImagen, RegistrarSensor, ListarSensor, ObtenerSensorPorId, ActualizarSensor, EliminarSensor }from '../controllers/IOT/SensorController.js'

const router = Router()
router.post('/registrar', cargarImagen,  RegistrarSensor)
router.get('/listar', ListarSensor)
router.get('/buscar/:id', ObtenerSensorPorId)
router.put('/actualizar/:id', cargarImagen, ActualizarSensor)
router.delete('/eliminar/:id', EliminarSensor)


export default router;