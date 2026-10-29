import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');

  const [tabActual, setTabActual] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Estado del formulario de nuevo/editar producto
  const [editandoId, setEditandoId] = useState(null);
  const [formProducto, setFormProducto] = useState({
    nombre: '', marca: '', precio: '', decant_precio: '', imagen: '', stock: 10
  });

  // Login de administrador
  const handleLogin = (e) => {
    e.preventDefault();
    if (usuario === 'admin' && clave === '12345') {
      setAutenticado(true);
      cargarDatos();
    } else {
      alert("Credenciales incorrectas.");
    }
  };

  // Cargar datos desde Supabase
  const cargarDatos = async () => {
    setCargando(true);
    try {
      const resProds = await supabase.from('productos').select('*').order('id', { ascending: true });
      if (resProds.data) setProductos(resProds.data);

      const resPeds = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
      if (resPeds.data) setPedidos(resPeds.data);
    } catch (err) {
      console.error("Error al cargar datos:", err.message);
    } finally {
      setCargando(false);
    }
  };

  // Guardar/Actualizar Producto
  const guardarProducto = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formProducto.nombre,
        marca: formProducto.marca,
        precio: Number(formProducto.precio),
        decant_precio: formProducto.decant_precio ? Number(formProducto.decant_precio) : null,
        imagen: formProducto.imagen,
        stock: Number(formProducto.stock)
      };

      if (editandoId) {
        await supabase.from('productos').update(payload).eq('id', editandoId);
        alert("Producto actualizado exitosamente.");
      } else {
        await supabase.from('productos').insert([payload]);
        alert("Nuevo producto agregado.");
      }

      setFormProducto({ nombre: '', marca: '', precio: '', decant_precio: '', imagen: '', stock: 10 });
      setEditandoId(null);
      cargarDatos();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  const seleccionarParaEditar = (prod) => {
    setEditandoId(prod.id);
    setFormProducto({
      nombre: prod.nombre,
      marca: prod.marca,
      precio: prod.precio,
      decant_precio: prod.decant_precio || '',
      imagen: prod.imagen,
      stock: prod.stock || 10
    });
  };

  const eliminarProducto = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      await supabase.from('productos').delete().eq('id', id);
      cargarDatos();
    }
  };

  const cambiarEstadoPedido = async (id, nuevoEstado) => {
    await supabase.from('pedidos').update({ estado: nuevoEstado }).eq('id', id);
    cargarDatos();
  };

  // -------------------------------------------------------------
  // PANTALLA DE LOGIN
  // -------------------------------------------------------------
  if (!autenticado) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm p-4 border-0" style={{ width: '350px' }}>
          <h5 className="fw-bold text-center mb-1">SU MEJOR ESENCIA CR</h5>
          <p className="text-muted small text-center mb-4">Panel de Administración</p>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Usuario</label>
              <input type="text" className="form-control py-2" required value={usuario} onChange={(e) => setUsuario(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">Contraseña</label>
              <input type="password" className="form-control py-2" required value={clave} onChange={(e) => setClave(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-dark w-100 py-2 fw-bold">Ingresar →</button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // PANEL ADMINISTRATIVO PRINCIPAL
  // -------------------------------------------------------------
  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">SU MEJOR ESENCIA CR · Admin Panel</span>
        <div className="ms-auto">
          <button className="btn btn-outline-light btn-sm" onClick={() => setAutenticado(false)}>Cerrar Sesión</button>
        </div>
      </nav>

      <div className="container py-4">
        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="d-flex gap-2 mb-4 border-bottom pb-2">
          <button 
            className={`btn btn-sm ${tabActual === 'productos' ? 'btn-dark fw-bold' : 'btn-outline-secondary'}`}
            onClick={() => setTabActual('productos')}
          >
            📦 Gestión de Inventario ({productos.length})
          </button>
          <button 
            className={`btn btn-sm ${tabActual === 'pedidos' ? 'btn-dark fw-bold' : 'btn-outline-secondary'}`}
            onClick={() => setTabActual('pedidos')}
          >
            🛒 Pedidos Recibidos ({pedidos.length})
          </button>
        </div>

        {cargando ? (
          <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>
        ) : tabActual === 'productos' ? (
          <div className="row g-4">
            {/* FORMULARIO */}
            <div className="col-lg-4">
              <div className="card shadow-sm p-4 border-0">
                <h6 className="fw-bold mb-3">{editandoId ? 'Editar Producto' : 'Agregar Nuevo Perfume'}</h6>
                <form onSubmit={guardarProducto}>
                  <div className="mb-2">
                    <label className="form-label small">Nombre del Perfume</label>
                    <input type="text" className="form-control py-1" required value={formProducto.nombre} onChange={(e) => setFormProducto({...formProducto, nombre: e.target.value})} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">Marca / Presentación</label>
                    <input type="text" className="form-control py-1" placeholder="Ej: Rasasi · 100ml" required value={formProducto.marca} onChange={(e) => setFormProducto({...formProducto, marca: e.target.value})} />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label small">Precio Botella (₡)</label>
                      <input type="number" className="form-control py-1" required value={formProducto.precio} onChange={(e) => setFormProducto({...formProducto, precio: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small">Precio Decant (₡)</label>
                      <input type="number" className="form-control py-1" placeholder="Opcional" value={formProducto.decant_precio} onChange={(e) => setFormProducto({...formProducto, decant_precio: e.target.value})} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small">URL de la Imagen</label>
                    <input type="url" className="form-control py-1" required value={formProducto.imagen} onChange={(e) => setFormProducto({...formProducto, imagen: e.target.value})} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small">Stock Disponible</label>
                    <input type="number" className="form-control py-1" required value={formProducto.stock} onChange={(e) => setFormProducto({...formProducto, stock: e.target.value})} />
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-dark btn-sm w-100 fw-bold">{editandoId ? 'Actualizar' : 'Guardar'}</button>
                    {editandoId && (
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setEditandoId(null); setFormProducto({ nombre: '', marca: '', precio: '', decant_precio: '', imagen: '', stock: 10 }); }}>Cancelar</button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* TABLA DE PRODUCTOS */}
            <div className="col-lg-8">
              <div className="card shadow-sm border-0 p-3">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr className="small">
                      <th>Imagen</th>
                      <th>Producto</th>
                      <th>Precio Botella</th>
                      <th>Decant</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {productos.map(p => (
                      <tr key={p.id}>
                        <td><img src={p.imagen} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded" /></td>
                        <td>
                          <div className="fw-bold">{p.nombre}</div>
                          <small className="text-muted">{p.marca}</small>
                        </td>
                        <td>₡{p.precio.toLocaleString()}</td>
                        <td>{p.decant_precio ? `₡${p.decant_precio.toLocaleString()}` : '-'}</td>
                        <td><span className="badge bg-secondary">{p.stock} unids</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline-dark me-1" onClick={() => seleccionarParaEditar(p)}>✏️</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarProducto(p.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* TABLA DE PEDIDOS */
          <div className="card shadow-sm border-0 p-3">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr className="small">
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Dirección</th>
                  <th>Total</th>
                  <th>Método</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody className="small">
                {pedidos.map(ped => (
                  <tr key={ped.id}>
                    <td>{new Date(ped.created_at).toLocaleDateString('es-CR')}</td>
                    <td>
                      <div className="fw-bold">{ped.cliente_nombre}</div>
                      <small className="text-muted">{ped.telefono}</small>
                    </td>
                    <td>{ped.direccion}, {ped.provincia}</td>
                    <td className="fw-bold">₡{ped.total.toLocaleString()}</td>
                    <td><span className="badge bg-light text-dark border">{ped.metodo_pago.toUpperCase()}</span></td>
                    <td>
                      <select 
                        className="form-select form-select-sm" 
                        value={ped.estado} 
                        onChange={(e) => cambiarEstadoPedido(ped.id, e.target.value)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Pago Confirmado">Pago Confirmado</option>
                        <option value="Enviado por Correos">Enviado por Correos</option>
                        <option value="Completado">Completado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}