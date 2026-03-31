import { useState, useEffect } from "react";
import "../styles/components/editForm.css";

const FormEdit = ({ editingProduct, setProducts, products, closeForm }) => {
  const [formData, setFormData] = useState(editingProduct);

  useEffect(() => {
    setFormData(editingProduct);
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Actualizar localmente
      setProducts(
        products.map((product) =>
          product._id === formData._id ? formData : product
        )
      );

      // Llamada PUT al backend
      const response = await fetch(`/api/productos/${formData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al actualizar el producto");

      closeForm(); // Cerrar el formulario
    } catch (error) {
      console.error("Error actualizando el producto:", error);
    }
  };

  if (!formData) return null;

  return (
    <div className="CardEdit">
      <form className="formEdit">
        <label><h3>Nombre</h3>
        <input type="text" name="nombre" className="input-edit" value={formData.nombre} onChange={handleChange} />
        </label>
        <label><h3>Precio</h3> 
          <input type="number" name="precio" className="input-edit" value={formData.precio} onChange={handleChange} />
        </label>
        <label><h3>Categoria</h3>
          <select name="categoria" className="input-edit" value={formData.categoria} onChange={handleChange}>
            <option value="moda">Moda</option>
            <option value="tecnologia">Tecnología</option>
            <option value="hogar">Hogar</option>
            <option value="electrodomésticos">Electrodomésticos</option>
            <option value="vehículos">Vehículos</option>
          </select>
         </label>
        <label><h3>Descripcion</h3>
          <textarea name="descripcion" className="input-edit" value={formData.descripcion} onChange={handleChange} />
        </label>
        <label>
          <h3>Stock</h3>
          <input type="number" className="input-edit" name="stock" value={formData.stock} onChange={handleChange} />
        </label>
        <div className="buttons">
        <button type="button" onClick={handleSave}>
          Guardar
        </button>
        <button type="button" onClick={closeForm}>
          Cerrar
        </button>
        </div>
        
      </form>
    </div>
  );
};

export default FormEdit;
