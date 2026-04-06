import '../styles/components/ProductCard.css'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { jsPDF } from 'jspdf'; 
import Carousel from './carusel';
import Loading from './loading';
import { useAuth } from '../context/AuthContext'

const ProductCard = ({id,usuario,imagenes, nombre, categoria, precio, descripcion, stock: initialStock})=>{
    const [product, setProduct] = useState([]);
    const [stock, setStock] = useState(initialStock);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onCarrito, setOnCarrito] = useState(false)
    const {user, isAuthenticated} = useAuth()
    const navigate = useNavigate();
  
    
    
    useEffect(() => {
        const fetchProduct = async () => {
          try {
            const response = await fetch(`/api/productos/${id}`);
            if (!response.ok) {
              throw new Error("Error al obtener el producto");
            }
            const data = await response.json();
            setProduct(data); // Guardar el producto con su estado de carrito
           
            if (user && Array.isArray(user.carrito)) {
            const itemExistente = user.carrito.find(
            item => item.product.toString() === id.toString()
             );
            setOnCarrito(!!itemExistente)
             }
    
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchProduct();
      }, [id, user]); 

    const toggleCarrito = async () => {
        if (!onCarrito) {
          try {
            const response = await fetch(`/api/users/${user.id}/carrito`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productoId: id})
            });
    
            if (response.ok) {
              setOnCarrito(true)
            } else {
              throw new Error("Error al agregar el producto al carrito");
            }
          } catch (error) {
            console.error(error);
          }
        }else{
          try {
            const response = await fetch(`/api/users/${user.id}/carrito`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productoId: id })
            })
            if (response.ok) {
              setOnCarrito(false)
            } else {
              throw new Error("Error al quitar al producto del carrito");
            }
          } catch (error) {
            console.log(error);
            
          }
        }
      };

      const downloadReceipt = () => {
        const doc = new jsPDF();
        doc.text(`Compra Confirmada:`, 10, 10);
        {isAuthenticated && (
          doc.text(`Usuario: ${user.userName}`, 10, 20)
        )}
        doc.text(`Producto: ${nombre}`, 10, 30);
        doc.text(`Categoría: ${categoria}`, 10, 40);
        doc.text(`Precio: $${precio}`, 10, 50);
        doc.text(`Descripción: ${descripcion}`, 10, 60);
        
        // Descargar el PDF
        doc.save(`Comprobante_${nombre}.pdf`);
    };

    const handleBuy = () => {
        setIsModalOpen(true);
    };

    // Confirmación de la compra
    const confirmPurchase = async() => {
        if (stock > 0) {
            // Disminuir el stock localmente
            const nuevoStock = stock - 1;
            setStock(nuevoStock);

            try {
                // Enviar la actualización del stock al backend
                const response = await fetch(`/api/productos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stock: nuevoStock })
                });

                if (!response.ok) {
                    throw new Error("Error al actualizar el stock");
                }
            } catch (error) {
                console.error("Error al actualizar el stock en el servidor", error);
            }

            downloadReceipt(); // Descargar el PDF
            setIsModalOpen(false); // Cerrar el modal
            navigate('/');
        } else {
            alert("Stock insuficiente");
        }
    };

     if (loading) return <Loading/>;
     if (error) return <p>{error}</p>;
     if (!product) return null;

    const publishedBy = usuario || product?.userName || product?.usuario?.userName || "Usuario desconocido";
    return(
        <div className="cardContainer">
            <section>
                <Carousel images={imagenes}></Carousel>
            </section>
            <aside>
                <h1 id='nombre'>{nombre}</h1>
                <p>Publicado por: {publishedBy}</p>
                <span id='categoriaCard'>{categoria}</span>
                <h1 id='precio'>${precio}</h1>
                <p id='descripcion'>{descripcion}</p>
                <h2 id='stock'>Disponibles: {stock}</h2>
                <div className="buttonSection">
                <button id='carro' onClick={toggleCarrito}>{ onCarrito? 'Quitar' : 'Agregar'} <img className='icono' src="/shopping_cart_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png" alt="carro" /></button>
                <button id='comprar' onClick={handleBuy}>Comprar <img className='icono' src="/local_mall_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png" alt="cartera" /></button>
                </div>
            </aside>
            {isModalOpen && (
                <div className="overlay">
                    <div className="modal">
                        <h2>Confirmar compra</h2>
                        <p>¿Deseas confirmar la compra del producto: <strong>{nombre}</strong>?</p>
                        <button id='confirmar' onClick={confirmPurchase}>Confirmar</button>
                        <button id='cancelar' onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductCard
