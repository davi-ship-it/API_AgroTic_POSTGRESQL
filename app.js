// app.js
import express from 'express';

import dotenv from 'dotenv';
dotenv.config();


import bodyParser from "body-parser";

import usuariosRouter from './src/routes/RouteCliente.js';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/UsuariosAll",usuariosRouter);



app.listen(3000, () => {
  console.log(`Servidor corriendoooo en http://localhost:3000`);
});


