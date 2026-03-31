import '../styles/components/form.css'
import { useState } from 'react';
const Form = ({ toggleFunction, onProductCreated })=>{
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [imagenes, setImagenes] = useState([])

    const handleImagenesChange = (e) => {
      const nuevosArchivos = Array.from(e.target.files);
      setImagenes((prevImagenes) => {
        const actualizados = [...prevImagenes, ...nuevosArchivos];
        return actualizados;
      });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    
        // Crear un objeto con los datos del formulario
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('categoria', categoria);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('stock', stock);

        // Agregar las imágenes seleccionadas al FormData
        for (let i = 0; i < imagenes.length; i++) {
            formData.append('imagenes', imagenes[i]);
        }
    
        try {
          // Hacer la solicitud POST al servidor
          const response = await fetch('/api/productos', {
            method: 'POST',
            body: formData, 
            credentials: 'include',
          });
    
          // Verificar si la respuesta fue exitosa
          if (response.ok) {
            const data = await response.json();
            console.log('Producto:', data);
            // Aquí puedes hacer algo con la respuesta del servidor, como redirigir
            setNombre('')
            setCategoria('')
            setPrecio('')
            setDescripcion('')
            setStock('')
            setImagenes([]);
            if (onProductCreated) {
              onProductCreated(data.producto);
            }
            toggleFunction()
            
          } else {
            console.error('Error en la solicitud:', response.status);
          }
        } catch (error) {
          console.error('Error al enviar el producto:', error);
        }
      };

    return(
        <div className="form-container">
          <h2>Añadir Producto</h2>
          <form onSubmit={handleSubmit}>
              <input className='input' type="text" placeholder='ingrese Nombre ' value={nombre} onChange={(e)=> setNombre(e.target.value)}/>
              <select className='input' name="categorias" id="categoria" value={categoria} onChange={(e)=> setCategoria(e.target.value)}>
                <option value="">ingrese categoria</option>
                <option value="moda">Moda</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="hogar">Hogar</option>
                <option value="electrodomesticos">Electrodomesticos</option>
                <option value="vehiculos">Vehiculos</option>
              </select>
              <input className='input' type="text" placeholder='ingrese descripcion' value={descripcion} onChange={(e)=> setDescripcion(e.target.value)}/>
              <input className='input' type="text" placeholder='ingrese precio' value={precio} onChange={(e)=> setPrecio(e.target.value)}/>
              <input className='input' type="text" placeholder='ingrese stock' value={stock} onChange={(e)=> setStock(e.target.value)}/>
              <input className='input' type="file" name='"files[]' multiple onChange={handleImagenesChange}/>
            <button type="submit">Agregar</button>
          
          </form>
          <button id='cerrar' onClick={toggleFunction}>Cerrar</button>
        </div>
      
    )
}

export default Form
