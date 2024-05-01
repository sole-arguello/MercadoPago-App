import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MercadoPagoConfig, Preference } from 'mercadopago';


dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())


const client = new MercadoPagoConfig(
	{ accessToken: process.env.ACCESS_TOKEN || ' ' }
);
app.post("/api/create_preference", async (req, res) => {

	
	try {
		const body = {
			items: [
				{
					title: req.body.title,
					unit_price: Number(req.body.price),
					quantity: Number(req.body.quantity),
					currency_id: "ARS"
				}
			],
			back_urls: {
				"success": "http://localhost:5173/",
				"failure": "",
				"pending": ""
			},
			auto_return: "approved",
		};
		const preference = await new Preference(client)
		.create({body})
		//console.log('preference', preference)
		res.status(200).json({ id: preference.id});
	} catch (error) {
		console.error('Error al crear la preferencia', error);
		res.status(500).json({ error: error });
	}
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
})