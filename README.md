Pasarella de MERCADO PAGO 2024
====
Son dos maneras que encontre para conectar:

  * La primera conenta directamente con la URL por medio del ACCESS TOKEN que redirecciona a la pasarrella
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
        `"/api/mercado_pago" ` (el nombre de la ruta a gusto)
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
        - Crear la preferencia:
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
            * auto_return: lo que hace es que si todo sale bien, direcciona a la pasarella de mercado pago con los datos del Item, para procesar el pago.
        - En postman o thunder client o el de preferencia hacer la prueba de coneccion:<br>
          Para hacer la prueba los datos lo cargue harcodeados, como muestra la imagen<br>
          Esta misma prueba se puede hacer cargando los datos desde el body<br>
          Debe mostrar la url de coneccion a la pasarrella, la cual si la pegamos al navegador debe confirmar que conectamos.
          
         <div style="display: flex; flex-direction: row">
          <img src='/Img/prueba-post.png' style="width: 70%; height: auto;">
          <img src='/Img/prueba-pago.png' style=" ">
         </div>
          
          
          
        
  

      
          
