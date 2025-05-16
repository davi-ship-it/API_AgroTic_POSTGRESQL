import { Router } from "express";

import { setFiltroFinanzas } from "../controllers/Fitosanitario/BuscadorFs.js";
import cultivoRouter from "./RouteCultivos.js";

const finanzasRouter = Router();

finanzasRouter.post("/Filtrar", setFiltroFinanzas);

export default  finanzasRouter