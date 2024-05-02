Pasarella de MERCADO PAGO 2024
====
Son dos maneras que encontre para conectar:

  * La primera conecta directamente con la URL por medio del ACCESS TOKEN que redirecciona a la pasarrella
  * La segunda conecta por medio de ACCESS TOKEN del lado del server, la KEY del lado del clinte y el boton
   Wallet que redirige a la pasarrella, como lo indica la [documentacion](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/integrate-checkout-pro/web)

**Voy a documentar ambas aqui paso a paso y con las pruebas en Thunder Client.**<br><br>

> Paso 1: **IMPORTANTE TENER EN CUENTA ESTAR LOGUEADO PARA ESTE PROCEDIMIENTO** 
<br>(Este paso aplica a las dos formas)
  * Ir a la pagina de [mercado pago developers](https://www.mercadopago.com.ar/developers/es)
  * En la solapa [Tus integraciones](https://www.mercadopago.com.ar/developers/panel/app)
  * Ir al boton CREAR APLICACION
  * Llenar el formulario:
  
      * Colocar un nombre
      * ¿Qué tipo de solución de pago vas a integrar? -> Pago Online
      * ¿Estás usando una plataforma de e-commerce? -> No
      * Qué producto estás integrando? -> CheckoutPro
      * Modelo de integración -> como es opcional no poner nada
      * Tildar la autorizacion
      * Validar que no eres u robot
   
 * Una vez creada la app, volver a imtegraciones y entrar en la app creada
 * Ir a la solapa Credenciales de Prueba y copiar:

   * Public Key
   * Access Token

 * Tambien dentro de integraciones en la solapa Tarjetas de Prueba extraer los datos de cualquier tarjeta para las pruebas
 * **IMPORTANTE**: desloguearse para hacer las pruebas del pago.<br><br>

### Para la forma 1:

> Paso 2: (Forma 1) Creacion de la estructura y configuracion del back con Node y Express

  * Crear una carpeta Server para el back 
  * Iniciar un proyecto: npm init -y
  * Instalar las dependencias express, cors, dotenv, nodemon, mercadopago
  * Configurar el package.json, para que corra con el comando `npm run dev o start`, a preferencia del desarrollador.
  * Crear en la raiz el archivo index.js y configurar el puerto en el que va escuhar el servidor.
  * Crear en la raiz un archivo .env para alojar la variable de entorno con el access token que brinda mercado pago.
  * Crear una carpeta src y dentro:

      * Crear el archivo Server.js:<br>
        . Importar `cors express`<br>
        . Configurar los midllewares, express, cors, express json
        . Configurar la ruta que va a conectar con la api de mercado pago.
        `"/api/MERCADO_PAGO" ` (el nombre de la ruta a gusto)
        . Verificar que levante el server

      * Crear una carpeta routes:<br>
        - En el archivo .env colocar el access token que brinda mercado pago:<br>
          ```
          ACCESS_TOKEN = " el access token de mercado pago "
          ```
        - En el archivo routes: <br>
          - importar `dotenv mercadopago y router`<br>
          ```
          import { Router } from "express";
          import mercadopago from "mercadopago";
          import dotenv from "dotenv";
          dotenv.config();
          ```
          - Poner la configuracion con el access token que brinda mercado pago y que extraigo del .env:
          ```
          mercadopago.configure({
              access_token: process.env.ACCESS_TOKEN || '',
          })
          ```

        - Aplicar un metodo POST `"/"` asincrona
        - Crear la preferencia:<br>
          En la response recibo un json con toda la data de mercado pago
        ```
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
        ```
        - Detalles de la preferencia:
          
            * En Items: va el cuerpo del producto, con su moneda a preferencia USD o ARS
            * En back_urls: los enlaces que creemos para devolver al cliente.
            * auto_return: lo que hace es que si todo sale bien, direcciona a la pasarella de mercado pago
               con los datos del Item, para procesar el pago.
   
            * Aqui capturo la url en el `init_point` que me brinda mercado pago, la cual cambia por cada consulta que recibe:
              ```
               const response = await mercadopago.preferences.create(preference);
               //console.log('Respuesta', response.body.init_point);
               res.status(200).json(response.body.init_point );
              ```
        - En postman o thunder client o el de preferencia hacer la prueba de coneccion:<br>
          Para hacer la prueba los datos lo cargue harcodeados, como muestra la imagen<br>
          Esta misma prueba se puede hacer cargando los datos desde el body<br>
          Debe mostrar la url de coneccion a la pasarrella, la cual si la pegamos al navegador debe confirmar que conectamos.
          
         
          <img src='/Img/prueba-post.png' style="width: 50%; height: auto;">
          <img src='/Img/prueba-pago.png' style="width: 46%; height: auto;">

        > Paso 3: (Forma 1) Creacion de la estructura y configuracion del Front con React Vite

          * Iniciar un proyecto vite:

              * `npm create vite@latest`
              * ` npm i` para intalacion de la carpeta node modules
              * Corro el proyecto con `npm run dev`
              * Intalar axios para las peticiones al back
              * En la raiz cree un json con 3 productos en la raiz del proyecto para simular la ecommerce:
                ```
                 [
                   {
                     "imagen": "https://via.placeholder.com/150",
                     "nombre": "Producto 1",
                     "precio": 20,
                     "cantidad": 1
                   },
                   {
                     "imagen": "https://via.placeholder.com/150",
                     "nombre": "Producto 2",
                     "precio": 30,
                     "cantidad": 1
                   },
                   {
                     "imagen": "https://via.placeholder.com/150",
                     "nombre": "Producto 3",
                     "precio": 25,
                     "cantidad": 1
                   }
                 ]
                ```
              * Dentro de la carpeta src crear un componente
              * En el componente:

                  * Importo axios
                  * Importo el json
                  * En un handle donde conecto con el back a la api de mercado pago:
                     ```
                      const response = await axios.post("http://localhost:3000/api/Mercado_Pago", products)
                      
                       //redirecciona a la pasarella de pago
                       window.location.href = response.data
                      }
                    ```       
              * Retorno las card con el boton que dirije a la pasarella para realizar el pago:
                 ```
                   return (
                    <div className="containerSuperior">
                        {
                            products.map((prod) => (
                                <div className="containerProducts" key={prod.id}>
                                    <img src={prod.imagen} alt={prod.nombre} />
                                    <h2>{prod.nombre}</h2>
                                    <p>${prod.precio}</p>
                
                                    <button onClick={() => handleBuy(prod)}>Comprar</button>
                                </div>
                            ))
                        }
                    </div>
                  )
                 ```
             * Al levantar el server de React visualizo la ecomerce de simulacion:
       
               <img src="/Img/simulador-front.png" style="width: 70%; height: auto;">
           
             * Al precionar el boton comprar direcciona a la pasarella y en la consola del navegador
               <br>se puede ver la url que brinda mercado pago :
           
              
               <img src="/Img/prueba-front.png" style="width: 70%; height: auto;">

      
> Paso 4: Hacer las pruebas de pago

  * Presionar pagar con tarjeta y llenar los campos con los datos de la tarjeta de prueba

     <img src="/Img/form1.png" style="width: 70%; height: auto;"> 
   
  * Llenar el campo DNI con cualquier numero falso:
      
     <img src="/Img/form2.png" style="width: 70%; height: auto;"> 

  * Elejir una cuota:

     <img src="/Img/form3.png" style="width: 70%; height: auto;"> 
     
  * Completar el campo email:

     <img src="/Img/form4.png" style="width: 70%; height: auto;"> 
     
  * Brinda el mensaje exitoso del pago y redirecciona nuevamento a la ecomerce:

     <img src="/Img/form5.png" style="width: 70%; height: auto;"> 


---------------------------------------------------------------------------------------------------------------------<br>
Para la forma 2:
  * Crear una carpeta Server para el back 
  * Iniciar un proyecto: npm init -y
  * Instalar las dependencias express, cors, dotenv, nodemon, mercadopago
  * Configurar el package.json, para que corra con el comando `npm run dev o start`, a preferencia del desarrollador.
  * Crear en la raiz un archivo .env para alojar la variable de entorno con el access token que brinda mercado pago.
  ```
    ACCESS_TOKEN = " el access token de mercado pago "
  ```
    
  * Crear en la raiz el archivo server.js:
     
        - Realizar las importaciones incluida la de mercado pago tal cual la [documentacion]()
        ```
         import express from 'express'
         import cors from 'cors'
         import dotenv from 'dotenv'
         import { MercadoPagoConfig, Preference } from 'mercadopago';
        ```
    
        - Configurar los midllewares, express, cors, express json.
        ```
         dotenv.config()
         const app = express()
         app.use(express.json())
         app.use(cors())
        ```

        - Configurar mercado pago tal cual la documentacion, con la variable proveniente del .env:
        ```
         const client = new MercadoPagoConfig(
         	{ accessToken: process.env.ACCESS_TOKEN || ' ' }
         );
        ```
    
        - Configurar el puerto para el servidor.
        - Verificar que al ejecutar `npm run dev` levante el servidor en el puerto configurado con exito.

    
        - En el archivo .env colocar el access token que brinda mercado pago:<br>
          ```
          ACCESS_TOKEN = " el access token de mercado pago "
          ```
        - En el archivo routes: <br>
          - importar `dotenv mercadopago y router`<br>
          ```
          import { Router } from "express";
          import mercadopago from "mercadopago";
          import dotenv from "dotenv";
          dotenv.config();
          ```
          - Poner la configuracion con el access token que brinda mercado pago y que extraigo del .env:
          ```
          mercadopago.configure({
              access_token: process.env.ACCESS_TOKEN || '',
          })
          ```

        - Aplicar un metodo POST `"/"` asincrona
        - Crear la preferencia:<br>
        ```
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
        ```
        - Detalles de la preferencia:
          
            * En Items: va el cuerpo del producto, con su moneda a preferencia USD o ARS
            * En back_urls: los enlaces que creemos para devolver al cliente.
            * auto_return: lo que hace es que si todo sale bien, direcciona a la pasarella de mercado pago
               con los datos del Item, para procesar el pago.

            * Aqui capturo el ID de la preferencia que me brinda mercado libre, la cual cambia por cada consulta:
            ```
              		const preference = await new Preference(client)
              		.create({body})
              		//console.log('preference', preference)
              		res.status(200).json({ id: preference.id});
            ```


     

    
     
