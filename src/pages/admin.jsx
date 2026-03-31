import { useState, useEffect } from "react";
import Form from "../components/form";
import FormEdit from "../components/editForm";
import Overlay from "../components/overlay";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";

const AdminSection = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const cloudinaryUrl = (publicId) =>
    `https://res.cloudinary.com/dsd3aqbqf/image/upload/${publicId}.jpg`;

  const toggleForm = () => setIsFormVisible(!isFormVisible);
  const changeEditForm = () => setIsEditing(!isEditing);

  const handleProductCreated = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    changeEditForm();
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("error al eliminar producto");

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      alert("producto eliminado exitosamente");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!user?.id) {
          return;
        }

        const response = await fetch(`/api/productos?usuarioId=${user.id}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Error al obtener los productos");

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?.id]);

  if (loading) return <p id="loading">Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {isFormVisible && (
        <Overlay
          contenido={
            <Form
              toggleFunction={toggleForm}
              onProductCreated={handleProductCreated}
            />
          }
        />
      )}

      <div className="AdminContainer">
        <aside>
          <h2>Panel de Administracion</h2>
          <button id="add" onClick={toggleForm}>
            <img
              src="/add_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
              alt="add"
            />
            agregar producto
          </button>
        </aside>

        <section>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Imagen</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Eliminar</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.nombre}</td>
                  <td>
                    {product.imagenes?.[0] ? (
                      <img
                        className="img"
                        src={cloudinaryUrl(product.imagenes[0])}
                        alt="img"
                      />
                    ) : null}
                  </td>
                  <td>{product.categoria}</td>
                  <td>{product.descripcion}</td>
                  <td>{product.precio}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      id="delete"
                      onClick={() => handleDeleteClick(product._id)}
                    >
                      <img
                        src="/delete_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 (1).png"
                        alt="delete"
                      />
                    </button>
                  </td>
                  <td>
                    <button id="edit" onClick={() => handleEditClick(product)}>
                      <img
                        src="/edit_note_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png"
                        alt="edit"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {isEditing && (
          <Overlay
            contenido={
              <FormEdit
                editingProduct={editingProduct}
                setProducts={setProducts}
                products={products}
                closeForm={() => setIsEditing(false)}
              />
            }
          />
        )}
      </div>
    </>
  );
};

export default AdminSection;
