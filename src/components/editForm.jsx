import { useState, useEffect } from "react";
import "../styles/components/editForm.css";
import { apiFetch } from "../api/config.js";

const MAX_IMAGENES = 5;
const MAX_NOMBRE = 60;
const MAX_DESCRIPCION = 300;

const FormEdit = ({ editingProduct, setProducts, products, closeForm }) => {
  const [formData, setFormData] = useState(editingProduct);
  const [existingImages, setExistingImages] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const cloudinaryUrl = (publicId) =>
    `https://res.cloudinary.com/dsd3aqbqf/image/upload/${publicId}.jpg`;

  useEffect(() => {
    setFormData(editingProduct);
    setExistingImages(editingProduct?.imagenes || []);
    setImagenesAEliminar([]);
    setNewImages([]);
    setErrorMessage("");
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleRemoveExistingImage = (publicId) => {
    setImagenesAEliminar((prevState) =>
      prevState.includes(publicId)
        ? prevState.filter((image) => image !== publicId)
        : [...prevState, publicId]
    );
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const cantidadActual = existingImages.length - imagenesAEliminar.length + newImages.length;
    const cupoDisponible = MAX_IMAGENES - cantidadActual;

    if (files.length > cupoDisponible) {
      setNewImages((prevImages) => [...prevImages, ...files.slice(0, cupoDisponible)]);
      setErrorMessage(`Solo puedes tener hasta ${MAX_IMAGENES} imagenes por producto.`);
    } else {
      setNewImages((prevImages) => [...prevImages, ...files]);
      setErrorMessage("");
    }
  };

  const removeNewImage = (indexToRemove) => {
    setNewImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSave = async () => {
    try {
      if (!formData.nombre?.trim() || formData.nombre.trim().length > MAX_NOMBRE) {
        setErrorMessage(`El titulo debe tener entre 1 y ${MAX_NOMBRE} caracteres.`);
        return;
      }

      if (!formData.descripcion?.trim() || formData.descripcion.trim().length > MAX_DESCRIPCION) {
        setErrorMessage(`La descripcion debe tener entre 1 y ${MAX_DESCRIPCION} caracteres.`);
        return;
      }

      const imagenesRestantes = existingImages.length - imagenesAEliminar.length + newImages.length;

      if (imagenesRestantes > MAX_IMAGENES) {
        setErrorMessage(`Solo puedes tener hasta ${MAX_IMAGENES} imagenes por producto.`);
        return;
      }

      const dataToSend = new FormData();
      dataToSend.append("nombre", formData.nombre);
      dataToSend.append("precio", formData.precio);
      dataToSend.append("categoria", formData.categoria);
      dataToSend.append("descripcion", formData.descripcion);
      dataToSend.append("stock", formData.stock);
      dataToSend.append("imagenesAEliminar", JSON.stringify(imagenesAEliminar));

      newImages.forEach((image) => {
        dataToSend.append("imagenes", image);
      });

      const response = await apiFetch(`/api/productos/${formData._id}`, {
        method: "PUT",
        body: dataToSend,
      });

      if (!response.ok) throw new Error("Error al actualizar el producto");

      const data = await response.json();

      setProducts(
        products.map((product) =>
          product._id === data.producto._id ? data.producto : product
        )
      );

      closeForm();
    } catch (error) {
      console.error("Error actualizando el producto:", error);
      setErrorMessage("No se pudo actualizar el producto.");
    }
  };

  if (!formData) return null;

  return (
    <div className="CardEdit">
      <form className="formEdit">
        <label><h3>Nombre</h3>
          <input type="text" name="nombre" className="input-edit" value={formData.nombre} maxLength={MAX_NOMBRE} onChange={handleChange} />
        </label>
        <p className="image-help text-limit">{formData.nombre?.length || 0}/{MAX_NOMBRE} caracteres</p>
        <label><h3>Precio</h3>
          <input type="number" name="precio" className="input-edit" value={formData.precio} onChange={handleChange} />
        </label>
        <label><h3>Categoria</h3>
          <select name="categoria" className="input-edit" value={formData.categoria} onChange={handleChange}>
            <option value="moda">Moda</option>
            <option value="tecnologia">Tecnología</option>
            <option value="hogar">Hogar</option>
            <option value="electrodomesticos">Electrodomésticos</option>
            <option value="vehiculos">Vehículos</option>
          </select>
        </label>
        <label><h3>Descripcion</h3>
          <textarea name="descripcion" className="input-edit" value={formData.descripcion} maxLength={MAX_DESCRIPCION} onChange={handleChange} />
        </label>
        <p className="image-help text-limit">{formData.descripcion?.length || 0}/{MAX_DESCRIPCION} caracteres</p>
        <label>
          <h3>Stock</h3>
          <input type="number" className="input-edit" name="stock" value={formData.stock} onChange={handleChange} />
        </label>

        <div className="image-editor">
          <h3>Imagenes actuales</h3>
          <div className="image-grid">
            {existingImages.map((image) => {
              const marcadaParaEliminar = imagenesAEliminar.includes(image);

              return (
                <div
                  key={image}
                  className={`image-card ${marcadaParaEliminar ? "image-card-remove" : ""}`}
                >
                  <img src={cloudinaryUrl(image)} alt="producto" />
                  <button
                    type="button"
                    className="image-action remove-image-btn"
                    onClick={() => toggleRemoveExistingImage(image)}
                  >
                    {marcadaParaEliminar ? "Restaurar" : "Eliminar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="image-editor">
          <h3>Agregar nuevas imagenes</h3>
          <input
            type="file"
            className="input-edit"
            accept="image/*"
            multiple
            onChange={handleNewImagesChange}
          />
          <p className="image-help">Máximo total: {MAX_IMAGENES} imagenes</p>

          {newImages.length > 0 ? (
            <div className="image-grid">
              {newImages.map((image, index) => (
                <div key={`${image.name}-${index}`} className="image-card">
                  <img src={URL.createObjectURL(image)} alt="nueva imagen" />
                  <button
                    type="button"
                    className="image-action remove-image-btn"
                    onClick={() => removeNewImage(index)}
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {errorMessage ? <p className="edit-error">{errorMessage}</p> : null}

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
