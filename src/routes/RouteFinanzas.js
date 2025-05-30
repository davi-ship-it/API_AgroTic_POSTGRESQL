import { Router } from "express";

import { getFinanzasCultivo} from "../controllers/Finanzas/BuscadorFs.js";

const finanzasRouter = Router();

finanzasRouter.get("/Filtrar/id", getFinanzasCultivo);


export default  finanzasRouter