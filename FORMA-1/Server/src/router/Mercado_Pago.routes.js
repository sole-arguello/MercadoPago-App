import { Router } from "express";
import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN || '',
})

router.post("/", async (req, res) => {

    const product  = req.body;
    //console.log("product", product);
    try {
        
        const preference = {
            items: [
                {
                    title: product.nombre, 
                    unit_price: product.precio,
                    quantity: product.cantidad,
                    currecy_id: 'USD',
                }
            ],

            back_urls: {
                success: 'http://localhost:5173/',
                failure: ' ',
            },

            auto_return: 'approved',
            
            
        }

        const response = await mercadopago.preferences.create(preference);
        //console.log('Respuesta', response.body.init_point);
        res.status(200).json(response.body.init_point );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
})

export { router as Mercado_Pago };

