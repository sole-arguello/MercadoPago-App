import express from "express";
import cors from "cors";
import { Mercado_Pago } from "./router/Mercado_Pago.routes.js";

const server = express();

//midllewares
server.use(express.json());
server.use(cors());
server.use('/api/Mercado_Pago', Mercado_Pago);


export default server