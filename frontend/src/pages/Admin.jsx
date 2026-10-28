import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [productos, setProductos] = useState([
    { id: 1, nombre: "Hawas Lava Gold", marca: "Rasasi · 100ml", precio: 32000, stock: 8, descripcion: "Especiado y amaderado", imagen: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80" },
    { id: 2, nombre: "Vanilla Vibe", marca: "Rayhaan · 100ml", precio: 25500, stock: 12, descripcion: "Vainilla dulce y envolvente", imagen: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80" },
    { id: 3, nombre: "Sigilo Noir", marca: "Luxe Edition · 100ml", precio: 34500, stock: 5, descripcion: "Tabaco y vainilla", imagen: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80" }
  ]);
  
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const [editandoId, setEditandoId] = useState(null);
  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && password === '12345') {
      setAutenticado(true);
    } else {
      alert('Credenciales incorrectas (Usuario: admin, Contraseña: 12345)');
    }
  };

  const guardarProducto = (e) => {
    e.preventDefault();
    if (editandoId) {
      setProductos(productos.map(p => p.id === editandoId ? { ...p, nombre, marca, precio: Number(precio), stock: Number(stock), descripcion, imagen } : p));
      alert('Inventario actualizado con éxito');
    } else {
      const nuevo = { id: Date.now(), nombre, marca, precio: Number(precio), stock: Number(stock), descripcion, imagen };
      setProductos([...productos, nuevo]);
      alert('Producto agregado con éxito');
    }
    limpiarFormulario();
  };

  const prepararEdicion = (prod) => {
    setEditandoId(prod.id);
    setNombre(prod.nombre);
    setMarca(prod.marca || '');
    setPrecio(prod.precio);
    setStock(prod.stock);
    setDescripcion(prod.descripcion);
    setImagen(prod.imagen);
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setMarca('');
    setPrecio('');
    setStock('');
    setDescripcion('');
    setImagen('');
  };

  if (!autenticado) {
    return (
      <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold">Panel Administrativo</h3>
            <p className="text-muted small">Ingresa tus credenciales de acceso</p>
          </div>
          <form onSubmit={handleLogin} className="card p-4 shadow-sm border-0 rounded-4">
            <input type="text" className="form-control mb-3" placeholder="Usuario (admin)" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
            <input type="password" className="form-control mb-3" placeholder="Contraseña (12345)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="btn btn-dark w-100 fw-bold py-2">Ingresar</button>
            <div className="text-center mt-3">
              <Link to="/" className="text-decoration-none small text-secondary">← Volver a la Tienda</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ color: '#1E2A24' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <h2 className="fw-bold m-0">Gestión de Inventario</h2>
          <Link to="/" className="btn btn-outline-dark btn-sm">🏠 Ver Tienda</Link>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={() => setAutenticado(false)}>Cerrar Sesión</button>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card p-4 shadow-sm border-0 rounded-4 bg-white">
            <h5 className="fw-bold mb-3">{editandoId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h5>
            <form onSubmit={guardarProducto}>
              <div className="mb-2">
                <label className="form-label small fw-bold">Nombre del Perfume</label>
                <input type="text" className="form-control" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Marca y Presentación (Ej. Rasasi · 100ml)</label>
                <input type="text" className="form-control" required value={marca} onChange={(e) => setMarca(e.target.value)} />
              </div>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold">Precio (CRC)</label>
                  <input type="number" className="form-control" required value={precio} onChange={(e) => setPrecio(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold">Stock Bodega</label>
                  <input type="number" className="form-control" required value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">URL de la Imagen</label>
                <input type="text" className="form-control" value={imagen} onChange={(e) => setImagen(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Descripción / Notas</label>
                <textarea className="form-control" rows="3" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-dark w-100 fw-bold">{editandoId ? 'Actualizar' : 'Guardar'}</button>
                {editandoId && <button type="button" className="btn btn-secondary" onClick={limpiarFormulario}>Cancelar</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card p-4 shadow-sm border-0 rounded-4 bg-white">
            <h5 className="fw-bold mb-3">Control de Stock ({productos.length} ítems)</h5>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        <img src={prod.imagen || 'https://via.placeholder.com/50'} alt={prod.nombre} className="rounded border" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                      </td>
                      <td className="fw-semibold">{prod.nombre}</td>
                      <td><small className="text-muted">{prod.marca}</small></td>
                      <td>₡{prod.precio.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${prod.stock <= 3 ? 'bg-danger' : 'bg-success'}`}>{prod.stock} disp.</span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => prepararEdicion(prod)}>✏️</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarProducto(prod.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
