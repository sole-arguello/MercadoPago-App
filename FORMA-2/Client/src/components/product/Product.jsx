import { useEffect, useState } from 'react'

import './Product.css'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import axios from 'axios'

const Product = () => {
   
    const [preferenceId, setPreferenceId] = useState()

    const productData = {
        title: 'Producto en Venta',
        price: 100,
        quantity: 1,
        currency_id: 'ARS',
    }
    
    const createPreference = async () =>{
        try {
            const res = await axios.post('http://localhost:3000/api/create_preference', productData)
            const { id } = res.data
            console.log("Respuesta de la preferencia",id)
            return id
        } catch (error) {
            console.log(' Error al crear la preferencia',error)
        }
    }

    useEffect(() => {
        const init = async () => {
            if (typeof import.meta.env.VITE_API_PUBLIC_KEY === 'string') {

                initMercadoPago(import.meta.env.VITE_API_PUBLIC_KEY || '')

                const id = await createPreference()
                if (id) {
                    setPreferenceId(id)
                }
            }
        }

        init()
    }, [])

    return (
        <div className="card-product-container">
            <div className="card-product">
            <h1>PRODUCTO EN EL CARRITO</h1>
                <div className="card">

                    
                    <img src="" alt="Product Image" />
                    <h3 >{productData.title}</h3>
                    <p className="price">$ { productData.price}</p>

                    
                    {/* BOTON DE DIRIGE AUTOMATICAMENTE A MERCADO PAGO */}
                    <div className='boton_wallet' id="wallet_container">
                        { preferenceId && 
                            <Wallet 
                                initialization={{ preferenceId: preferenceId }} 
                                customization={{ texts:{ valueProp: 'smart_option'}}} 
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Product



// import { useEffect, useState } from 'react'

// import './Product.css'
// import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
// import axios from 'axios'

// const Product = () => {
   
//     const [preferenceId, setPreferenceId] = useState()
//     useEffect(() => {
//         if (typeof import.meta.env.VITE_API_PUBLIC_KEY === 'string') {
//           initMercadoPago(import.meta.env.VITE_API_PUBLIC_KEY || '')
//         }
//       }, [])

//     const productData = {
//         title: 'Producto en Venta',
//         price: 100,
//         quantity: 1,
//         currency_id: 'ARS',
       
//     }
//     const createPreference = async () =>{
//         try {
//             //envio los datos para crear la preferencia en mercado pago
//             const res = await axios.post('http://localhost:3000/api/create_preference', productData)
//             const { id } = res.data
//             console.log("Respuesta de la preferencia",id)
//             return id
//         } catch (error) {
//             console.log(' Error al crear la preferencia',error)
//         }
//     }


//     const handleBuy = async () => {
//         const id = await createPreference()
//         console.log("ID", id)
//         if(id){
//             setPreferenceId(id)
//         }
//     }
// return (
//     <div className="card-product-container">
//         <div className="card-product">
//             <div className="card">
//                 <img src="" alt="Product Image" />
//                 <h3 >{productData.title}</h3>
//                 <p className="price">{ productData.price}</p>
//                 <button onClick={handleBuy}>Buy</button>
//                 <div id="wallet_container">
//                 { preferenceId && 
//                 <Wallet initialization={{ preferenceId: preferenceId }} 
//                 customization={{ texts:{ valueProp: 'smart_option'}}} />

//                 }
//                 </div>

//             </div>
//         </div>
//     </div>
//   )
// }
// export default Product