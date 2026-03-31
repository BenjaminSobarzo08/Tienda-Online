const ProductTable = ({
  products,
  cloudinaryUrl,
  onDelete,
  onEdit,
}) => {
  return (
    <section className="table-card">
      <div className="table-header">
        <h3>Listado de productos</h3>
        <span>{products.length} registrados</span>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h3>Aún no publicaste productos</h3>
          <p>Cuando cargues uno nuevo, aparecerá acá junto a tu información de usuario.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Usuario</th>
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
                  <td>{product.usuario?.userName || "Sin usuario"}</td>
                  <td>
                    {product.imagenes?.[0] ? (
                      <img
                        className="img"
                        src={cloudinaryUrl(product.imagenes[0])}
                        alt="img"
                      />
                    ) : (
                      <span className="no-image">Sin imagen</span>
                    )}
                  </td>
                  <td>{product.categoria}</td>
                  <td>{product.descripcion}</td>
                  <td>${product.precio}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button id="delete" onClick={() => onDelete(product._id)}>
                      Eliminar
                    </button>
                  </td>
                  <td>
                    <button id="edit" onClick={() => onEdit(product)}>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProductTable;
