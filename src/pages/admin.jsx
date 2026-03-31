import { useState, useEffect } from "react";
import Form from "../components/form";
import FormEdit from "../components/editForm";
import Overlay from "../components/overlay";
import UserPanel from "../components/UserPanel";
import ProductTable from "../components/ProductTable";
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
    } catch (deleteError) {
      console.log(deleteError.message);
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
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?.id]);

  if (loading) return <p id="loading">Cargando panel...</p>;
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
        <div className="admin-shell">
          <UserPanel products={products} />

          <main className="admin-main">
            <header className="admin-header">
              <div>
                <p className="eyebrow">Administración</p>
                <h1>Tus productos publicados</h1>
                <p className="admin-subtitle">
                  Gestiona los productos que agregaste y mantén actualizada tu información.
                </p>
              </div>

              <button className="primary-btn add-product-btn" onClick={toggleForm}>
                Agregar producto
              </button>
            </header>

            <ProductTable
              products={products}
              cloudinaryUrl={cloudinaryUrl}
              onDelete={handleDeleteClick}
              onEdit={handleEditClick}
            />
          </main>
        </div>

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
