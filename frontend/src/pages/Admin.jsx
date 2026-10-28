import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [autenticado, setAutenticado] = useState(false);
  
  // Credenciales
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  // Formulario Producto & Inventario
  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');

  const cargarDatos = () => {
    fetch('http://localhost:5000/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));

    fetch('http://localhost:5000/api/ordenes')
      .then((res) => res.json())
      .then((data) => setOrdenes(data))
      .catch((err) => console.error(err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && password === '12345') {
      setAutenticado(true);
      cargarDatos();
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const guardarProducto = (e) => {
    e.preventDefault();
    const datos = { 
      nombre, 
      precio: Number(precio), 
      stock: stock !== '' ? Number(stock) : 10, 
      descripcion, 
      imagen 
    };

    const url = editandoId 
      ? `http://localhost:5000/api/productos/${editandoId}` 
      : 'http://localhost:5000/api/productos';
      
    const metodo = editandoId ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    })
      .then((res) => res.json())
      .then(() => {
        alert(editandoId ? 'Inventario actualizado con éxito' : 'Producto agregado con éxito');
        limpiarFormulario();
        cargarDatos();
      })
      .catch((err) => console.error(err));
  };

  const prepararEdicion = (prod) => {
    setEditandoId(prod.id);
    setNombre(prod.nombre);
    setPrecio(prod.precio);
    setStock(prod.stock !== undefined ? prod.stock : 10);
    setDescripcion(prod.descripcion || '');
    setImagen(prod.imagen || '');
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto del inventario?')) {
      fetch(`http://localhost:5000/api/productos/${id}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then(() => {
          alert('Producto eliminado');
          cargarDatos();
        })
        .catch((err) => console.error(err));
    }
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setPrecio('');
    setStock('');
    setDescripcion('');
    setImagen('');
  };

  if (!autenticado) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '400px' }}>
        <h3 className="fw-bold mb-4">Panel Secreto</h3>
        <form onSubmit={handleLogin} className="card p-4 shadow-sm border-0">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-dark w-100 fw-bold">Ingresar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ color: '#1E2A24' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0">Gestión de Inventario y Catálogo</h2>
        <button className="btn btn-outline-danger btn-sm" onClick={() => setAutenticado(false)}>Cerrar Sesión</button>
      </div>

      <div className="row g-4">
        {/* COLUMNA FORMULARIO */}
        <div className="col-lg-4">
          <div className="card p-4 shadow-sm border-0 rounded-3 bg-white">
            <h5 className="fw-bold mb-3">{editandoId ? '✏️ Modificar Stock / Info' : '➕ Nuevo Producto'}</h5>
            <form onSubmit={guardarProducto}>
              <div className="mb-2">
                <label className="form-label small fw-bold">Nombre del Perfume</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold">Precio (CRC)</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Stock Bodega</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    placeholder="Ej: 5"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">URL de la Imagen</label>
                <input
                  type="text"
                  className="form-control"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Descripción / Notas</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-dark w-100 fw-bold">
                  {editandoId ? 'Actualizar Inventario' : 'Guardar Producto'}
                </button>
                {editandoId && (
                  <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* COLUMNA TABLA DE INVENTARIO */}
        <div className="col-lg-8">
          <div className="card p-4 shadow-sm border-0 rounded-3 bg-white">
            <h5 className="fw-bold mb-3">Control de Stock en Tiempo Real ({productos.length} ítems)</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock Actual</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => {
                    const stockActual = prod.stock !== undefined ? prod.stock : 10;
                    return (
                      <tr key={prod.id}>
                        <td>
                          <img
                            src={prod.imagen || 'https://via.placeholder.com/50'}
                            alt={prod.nombre}
                            className="rounded border"
                            style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                          />
                        </td>
                        <td className="fw-semibold">{prod.nombre}</td>
                        <td>₡{prod.precio.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${stockActual <= 3 ? 'bg-danger' : 'bg-success'}`}>
                            {stockActual} disponibles
                          </span>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => prepararEdicion(prod)}
                          >
                            ✏️ Editar Stock
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarProducto(prod.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}