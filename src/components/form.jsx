import '../styles/components/form.css';
import { useState } from 'react';
import { apiFetch } from '../api/config.js';

const Form = ({ toggleFunction, onProductCreated }) => {
  const MAX_IMAGENES = 5;
  const MAX_NOMBRE = 60;
  const MAX_DESCRIPCION = 300;
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [errors, setErrors] = useState({});
  const [imagenesMensaje, setImagenesMensaje] = useState('');

  const validateFields = () => {
    const newErrors = {};

    if (!nombre.trim()) newErrors.nombre = true;
    if (nombre.trim().length > MAX_NOMBRE) newErrors.nombre = true;
    if (!categoria.trim()) newErrors.categoria = true;
    if (!descripcion.trim()) newErrors.descripcion = true;
    if (descripcion.trim().length > MAX_DESCRIPCION) newErrors.descripcion = true;
    if (!precio.toString().trim()) newErrors.precio = true;
    if (!stock.toString().trim()) newErrors.stock = true;
    if (imagenes.length === 0) newErrors.imagenes = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName) => {
    setErrors((prevErrors) => {
      if (!prevErrors[fieldName]) return prevErrors;

      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldName];
      return updatedErrors;
    });
  };

  const handleImagenesChange = (e) => {
    const nuevosArchivos = Array.from(e.target.files);
    const totalImagenes = [...imagenes, ...nuevosArchivos];

    if (totalImagenes.length > MAX_IMAGENES) {
      setImagenes(totalImagenes.slice(0, MAX_IMAGENES));
      setImagenesMensaje(`Solo puedes agregar hasta ${MAX_IMAGENES} imagenes.`);
    } else {
      setImagenes(totalImagenes);
      setImagenesMensaje('');
    }

    if (nuevosArchivos.length > 0) {
      clearFieldError('imagenes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('categoria', categoria);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('stock', stock);

    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }

    try {
      const response = await apiFetch('/api/productos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setNombre('');
        setCategoria('');
        setPrecio('');
        setDescripcion('');
        setStock('');
        setImagenes([]);
        setErrors({});
        setImagenesMensaje('');

        if (onProductCreated) {
          onProductCreated(data.producto);
        }

        toggleFunction();
      } else {
        console.error('Error en la solicitud:', response.status);
      }
    } catch (error) {
      console.error('Error al enviar el producto:', error);
    }
  };

  return (
    <div className="form-container">
      <h2>Añadir Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          className={`input ${errors.nombre ? 'input-error' : ''}`}
          type="text"
          placeholder="ingrese Nombre"
          value={nombre}
          maxLength={MAX_NOMBRE}
          onChange={(e) => {
            setNombre(e.target.value);
            clearFieldError('nombre');
          }}
        />
        <p className={`input-help ${errors.nombre ? 'input-help-error' : ''}`}>
          {nombre.length}/{MAX_NOMBRE} caracteres
        </p>
        <select
          className={`input ${errors.categoria ? 'input-error' : ''}`}
          name="categorias"
          id="categoria"
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            clearFieldError('categoria');
          }}
        >
          <option value="">ingrese categoria</option>
          <option value="moda">Moda</option>
          <option value="tecnologia">Tecnologia</option>
          <option value="hogar">Hogar</option>
          <option value="electrodomesticos">Electrodomesticos</option>
          <option value="vehiculos">Vehiculos</option>
        </select>
        <input
          className={`input ${errors.descripcion ? 'input-error' : ''}`}
          type="text"
          placeholder="ingrese descripcion"
          value={descripcion}
          maxLength={MAX_DESCRIPCION}
          onChange={(e) => {
            setDescripcion(e.target.value);
            clearFieldError('descripcion');
          }}
        />
        <p className={`input-help ${errors.descripcion ? 'input-help-error' : ''}`}>
          {descripcion.length}/{MAX_DESCRIPCION} caracteres
        </p>
        <input
          className={`input ${errors.precio ? 'input-error' : ''}`}
          type="text"
          placeholder="ingrese precio"
          value={precio}
          onChange={(e) => {
            setPrecio(e.target.value);
            clearFieldError('precio');
          }}
        />
        <input
          className={`input ${errors.stock ? 'input-error' : ''}`}
          type="text"
          placeholder="ingrese stock"
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
            clearFieldError('stock');
          }}
        />
        <input
          className={`input ${errors.imagenes ? 'input-error' : ''}`}
          type="file"
          name='"files[]'
          multiple
          accept="image/*"
          onChange={handleImagenesChange}
        />
        <p className={`input-help ${imagenesMensaje ? 'input-help-error' : ''}`}>
          {imagenesMensaje || `Maximo ${MAX_IMAGENES} imagenes`}
        </p>
        <button type="submit">Agregar</button>
      </form>
      <button id="cerrar" onClick={toggleFunction}>Cerrar</button>
    </div>
  );
};

export default Form;
