import ProductCard from '../components/ProductCard'
import '../styles/product.css'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loading from '../components/loading';
import AdminButton from '../components/AdminButton';
import { apiFetch } from '../api/config.js';



const ProductSection = ()=>{
    const { id } = useParams();

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cloudinaryUrl = (publicId) => 
      `https://res.cloudinary.com/dsd3aqbqf/image/upload/${publicId}.jpg`;

    useEffect(()=>{
        const getProduct = async ()=>{
            try {
                const response = await apiFetch(`/api/productos/${id}`);
                if (!response.ok) {
                  throw new Error("Error al obtener los productos");
                }
                const data = await response.json();
                setProduct(data);  
              } catch (err) {
                setError(err.message); 
              } finally {
                setLoading(false);  
              }
        }
        getProduct();
    }, [])

    
    if (loading) return <Loading/>;
    if (error) return <p>{error}</p>;
    return(
        <div className="ProductContainer">
         <ProductCard
          id={product._id}
          usuario={product.userName || product.usuario?.userName}
          imagenes={product.imagenes} 
          nombre={product.nombre}
          categoria={product.categoria}
          descripcion={product.descripcion}
          precio={product.precio}
          stock={product.stock}
          />
          <AdminButton/>
        </div>
    )
}

export default ProductSection
