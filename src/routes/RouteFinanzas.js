import { Router } from "express";

import { setFiltroFinanzas } from "../controllers/Finanzas/BuscadorFs.js";

const finanzasRouter = Router();

finanzasRouter.post("/Filtrar", setFiltroFinanzas);

export default  finanzasRouter