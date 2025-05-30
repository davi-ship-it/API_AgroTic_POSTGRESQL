import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import bodyParser from "body-parser";
import usuariosRouter from './src/routes/RouteCliente.js';
import authRouter from './src/routes/authRoutes.js';
import cultivos from './src/routes/RouteCultivos.js';
import zonas from './src/routes/RouteZonas.js'
import cosechas from './src/routes/RouteCosecha.js'
import actividades from './src/routes/RouteActividades.js'
import mediSensor from './src/routes/Routemedisensor.js'
import finanzasRouter from './src/routes/RouteFinanzas.js';
import Epa from './src/routes/RouteEpa.js'
import inventario from './src/routes/RouteInventario.js'
import sensor from './src/routes/RouteSensor.js'
import tiposensor from './src/routes/RouteTipoSensor.js'

import routerCategoria from './src/routes/RouteCategoria.js';

import router_UsuariosActividades from './src/routes/Routeusuarios_x_actividades.js';

import router_Variedad from './src/routes/RouteVariedad.js';



const app = express();

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use("/UsuariosAll", usuariosRouter);
app.use("/auth", authRouter);
app.use('/cultivo', cultivos);

app.use('/zona', zonas)
app.use('/cosecha', cosechas)
app.use('/actividad', actividades)
app.use('/medisensor', mediSensor)
app.use ('/epa', Epa)
app.use('/inventario', inventario)
app.use('/sensor', sensor)
app.use("/Finanzas", finanzasRouter)
app.use('/tiposensor', tiposensor)



app.use("/Inventario", routerCategoria)

app.use("/Usuarios", router_UsuariosActividades)

app.use("/Cultivos", router_Variedad)


app.listen(3000, () => {
  console.log(`Servidor corriendo en el puerto 3000`);
});

/*Hola, hagan comentarios en el codigo si modifican algo */
/*segundo*/ 


