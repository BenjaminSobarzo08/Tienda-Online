import '../styles/home.css';
import Card from '../components/Cards';
import Buscador from '../components/buscador';
import Loading from '../components/loading';
import AdminButton from '../components/AdminButton';
import { useState, useEffect } from "react";
import { apiFetch } from '../api/config.js';

const Home = () => {
    //const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productosFiltrados, setProductosFiltrados] = useState([]); // Estado para productos filtrados
    useEffect(() => {
        // Función para obtener los productos desde el backend
        const fetchProducts = async () => {
            try {
                const response = await apiFetch("/api/productos");
                if (!response.ok) {
                    throw new Error("Error al obtener los productos");
                }
                const data = await response.json();
                
                //setProducts(data); // Guarda los productos en el estado
                setProductosFiltrados(data); // Inicialmente, los productos filtrados son todos los productos
            } catch (err) {
                setError(err.message); // Maneja errores
            } finally {
                setLoading(false); // Termina la carga
            }
        };

        fetchProducts(); // Llama a la función al montar el componente
    }, []); // Solo se ejecuta una vez al montar

    const ProductosDisponibles = productosFiltrados.filter(product => product.stock > 0)
    console.log(ProductosDisponibles.length)
    if (loading) return <Loading/>;
    if (error) return <p>{error}</p>;
   // if(!ProductosDisponibles.length) return <div className='SinResultado'><h1>Sin Resultados</h1></div>
    return (
        <div className="home-container">
            <div className="head">
                <Buscador setProductosFiltrados={setProductosFiltrados} /> {/* Pasa la función para actualizar los productos filtrados */}
            </div>
            {!ProductosDisponibles.length && (
                <div className='SinResultado'>
                  <h1>Sin Resultados</h1>
                </div>
            )}
            <div className='box-container'>
            <div className='ProductsContainer'>
                {ProductosDisponibles.map((product) => (
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
            </div>
            <AdminButton/>
        </div>
    );
};

export default Home;
