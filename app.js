// app.js
import express from 'express';

import dotenv from 'dotenv';
dotenv.config();


import bodyParser from "body-parser";

import usuariosRouter from './src/routes/RouteCliente.js';

import cultivoRouter from './src/routes/RouteCultivos.js';

import finanzasRouter from './src/routes/RouteFinanzas.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/UsuariosAll",usuariosRouter);



app.use("/Cultivos", cultivoRouter)


app.use("/Finanzas", finanzasRouter)



app.listen(3000, () => {
  console.log(`Servidor corriendoooo en http://localhost:3000`);
});


