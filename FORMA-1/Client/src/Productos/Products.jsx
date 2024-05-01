import products from "../../products.json"
import './Products.css'
import axios from "axios"
0
const Products = () => {

    const buy = async (products) => {
        const response = await axios.post("http://localhost:3000/api/Mercado_Pago", products)
        //console.log(response.data)

       window.location.href = response.data
        
    }
  return (
    <div className="containerSuperior">
        {
            products.map((prod) => (
                <div className="containerProducts" key={prod.id}>
                    <img src={prod.imagen} alt={prod.nombre} />
                    <h2>{prod.nombre}</h2>
                    <p>${prod.precio}</p>

                    <button onClick={() => buy(prod)}>Comprar</button>
                </div>
            ))
        }
    </div>
  )
}

export default Products