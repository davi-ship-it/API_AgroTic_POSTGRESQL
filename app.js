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



const app = express();

app.use(express.static('public'));

// Middleware para procesar JSON y URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use("/UsuariosAll", usuariosRouter);
app.use("/auth", authRouter);
app.use('/cultivo', cultivos);
app.use('/cultivo', cultivos);

app.use('/zona', zonas)
app.use('/cosecha', cosechas)
app.use('/actividad', actividades)
app.use('/medisensor', mediSensor)


app.use("Finanzas", finanzasRouter)


app.listen(3000, () => {
  console.log(`Servidor corriendo en el puerto 3000`);
});

/*Hola, hagan comentarios en el codigo si modifican algo */
/*segundo*/ 


