import {useState, useEffect} from 'react'
import Card from '../components/Cards';
import Loading from '../components/loading';
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';
import { apiFetch } from '../api/config.js';

const CarritoSection = ()=>{
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth()

  useEffect(() => {
    // Función para obtener todos los productos
    const fetchProducts = async () => {
      try {
        const response = await apiFetch(`/api/users/${user.id}/carrito`);
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);  // Solo se ejecuta una vez al montar

  if (loading) return <Loading/>;
  if (error) return <p>{error}</p>;
  if (products.length === 0) return <div className='SinResultado'><h1>carrito vacio</h1></div>;

    return(
        <div className="ProductsContainer">
         {products.map((product) => (
          <Card
          key={product._id}
          id={product._id}
          image={product.imagenes[0]}
          title={product.nombre}
          descripcion={product.descripcion}
          precio={product.precio}
          />
         ))}
        </div>
    )
}

export default CarritoSection
