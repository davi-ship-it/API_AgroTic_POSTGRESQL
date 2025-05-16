import { Router } from "express";
import { getDataCultivoUnico } from "../controllers/Cultivos/Detalles.js";

const cultivoRouter = Router();

cultivoRouter.get("/ListarData", getDataCultivoUnico);

export default cultivoRouter

