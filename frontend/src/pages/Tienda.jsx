import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pantallaCheckout, setPantallaCheckout] = useState(false);
  const [metodoPago, setMetodoPago] = useState('tarjeta');

  // Estado para Cupones
  const [codigoCupon, setCodigoCupon] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0); // Porcentaje
  const [mensajeCupon, setMensajeCupon] = useState({ texto: '', tipo: '' });

  const [formData, setFormData] = useState({
    correo: '', nombre: '', apellidos: '', direccion: '',
    provincia: 'San José', canton: '', distrito: '', telefono: '',
    numeroTarjeta: '', expiracion: '', cvv: '', nombreTitular: ''
  });

  // -------------------------------------------------------------
  // CARGAR PRODUCTOS DESDE SUPABASE
  // -------------------------------------------------------------
  useEffect(() => {
    async function obtenerProductos() {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        if (data) setProductos(data);
      } catch (err) {
        console.error("Error cargando productos:", err.message);
      } finally {
        setCargando(false);
      }
    }
    obtenerProductos();
  }, []);

  // -------------------------------------------------------------
  // POPSTATE (BOTÓN ATRÁS EN MÓVILES)
  // -------------------------------------------------------------
  useEffect(() => {
    const manejarBotonAtras = () => {
      if (pantallaCheckout) {
        setPantallaCheckout(false);
        return;
      }
      if (mostrarCarrito) {
        setMostrarCarrito(false);
        return;
      }
    };
    window.addEventListener('popstate', manejarBotonAtras);
    return () => window.removeEventListener('popstate', manejarBotonAtras);
  }, [pantallaCheckout, mostrarCarrito]);

  const abrirCarritoModal = () => {
    window.history.pushState({ modal: 'carrito' }, '');
    setMostrarCarrito(true);
  };

  const cerrarCarritoModal = () => {
    setMostrarCarrito(false);
    if (window.history.state?.modal === 'carrito') window.history.back();
  };

  const irAlCheckout = () => {
    setMostrarCarrito(false);
    window.history.pushState({ modal: 'checkout' }, '');
    setPantallaCheckout(true);
  };

  const volverDeCheckout = () => {
    setPantallaCheckout(false);
    if (window.history.state?.modal === 'checkout') window.history.back();
  };

  // -------------------------------------------------------------
  // FILTRADO AVANZADO DE PRODUCTOS
  // -------------------------------------------------------------
  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                             p.marca.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === 'Todos' || p.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  // -------------------------------------------------------------
  // LÓGICA DEL CARRITO
  // -------------------------------------------------------------
  const agregarAlCarrito = (producto, esDecant = false) => {
    if (!esDecant && producto.stock <= 0) {
      alert("Este producto se encuentra agotado actualmente.");
      return;
    }

    const itemAAgregar = {
      ...producto,
      id: esDecant ? `${producto.id}-decant` : producto.id,
      nombre: esDecant ? `Decant ${producto.nombre} (2ml)` : producto.nombre,
      precio: esDecant ? (producto.decant_precio || producto.decantPrecio) : producto.precio
    };

    setCarrito(prev => {
      const existe = prev.find(item => item.id === itemAAgregar.id);
      if (existe) {
        return prev.map(item => item.id === itemAAgregar.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...itemAAgregar, cantidad: 1 }];
    });
    
    if (!mostrarCarrito) abrirCarritoModal();
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito(prev => prev.map(item => {
      if (item.id === id) {
        const nueva = item.cantidad + delta;
        return nueva > 0 ? { ...item, cantidad: nueva } : null;
      }
      return item;
    }).filter(Boolean));
  };

  // -------------------------------------------------------------
  // CÁLCULO DE TOTALES Y CUPONES
  // -------------------------------------------------------------
  const subtotalBase = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const montoDescuento = (subtotalBase * descuentoAplicado) / 100;
  const subtotalConDescuento = subtotalBase - montoDescuento;
  const costoEnvio = subtotalConDescuento > 0 ? 2900 : 0;
  const totalGeneral = subtotalConDescuento + costoEnvio;
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  const validarCupon = async (e) => {
    e.preventDefault();
    if (!codigoCupon.trim()) return;

    try {
      const { data, error } = await supabase
        .from('cupones')
        .select('*')
        .eq('codigo', codigoCupon.trim().toUpperCase())
        .eq('activo', true)
        .single();

      if (error || !data) {
        setMensajeCupon({ texto: 'Cupón no válido o expirado.', tipo: 'danger' });
        setDescuentoAplicado(0);
      } else {
        setDescuentoAplicado(data.descuento_porcentaje);
        setMensajeCupon({ texto: `¡Cupón del ${data.descuento_porcentaje}% aplicado exitosamente!`, tipo: 'success' });
      }
    } catch (err) {
      setMensajeCupon({ texto: 'Error al verificar el cupón.', tipo: 'danger' });
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // -------------------------------------------------------------
  // PROCESAMIENTO DE PAGO
  // -------------------------------------------------------------
  const procesarPago = async (e) => {
    e.preventDefault();

    if (metodoPago === 'tarjeta' && (!formData.numeroTarjeta || !formData.expiracion || !formData.cvv)) {
      alert("Por favor completa los datos de la tarjeta.");
      return;
    }

    try {
      const { error } = await supabase.from('pedidos').insert([
        {
          cliente_nombre: `${formData.nombre} ${formData.apellidos}`,
          telefono: formData.telefono,
          direccion: `${formData.direccion}, ${formData.canton}, ${formData.distrito}`,
          provincia: formData.provincia,
          total: totalGeneral,
          metodo_pago: metodoPago,
          estado: 'Pendiente',
          items: carrito
        }
      ]);

      if (error) throw error;

      const numPedido = Math.floor(100000 + Math.random() * 900000);

      if (metodoPago === 'sinpe') {
        const telefonoTienda = "50688888888";
        const resumenProductos = carrito.map(i => `• ${i.nombre} x${i.cantidad}`).join('\n');
        
        const mensajeWhatsApp = encodeURIComponent(
          `¡Hola Su Mejor Esencia CR! 🌸\n\n` +
          `Acabo de realizar la orden por SINPE Móvil.\n\n` +
          `📌 *Orden #${numPedido}*\n` +
          `👤 *Cliente:* ${formData.nombre} ${formData.apellidos}\n` +
          `📞 *Teléfono:* ${formData.telefono}\n` +
          `📍 *Dirección:* ${formData.direccion}, ${formData.canton}, ${formData.provincia}\n\n` +
          `🛍️ *Productos:*\n${resumenProductos}\n\n` +
          `💰 *Total Transferido:* ₡${totalGeneral.toLocaleString()}\n\n` +
          `Adjunto el comprobante de pago a continuación.`
        );

        window.open(`https://wa.me/${telefonoTienda}?text=${mensajeWhatsApp}`, '_blank');
      }

      alert(`¡Orden #${numPedido} registrada con éxito! Gracias por comprar en Su Mejor Esencia.`);
      setCarrito([]);
      setDescuentoAplicado(0);
      setCodigoCupon('');
      volverDeCheckout();

      // Recargar catálogo para refrescar inventario descontado
      const { data } = await supabase.from('productos').select('*').order('id', { ascending: true });
      if (data) setProductos(data);

    } catch (err) {
      alert("Error al procesar el pedido: " + err.message);
    }
  };

  // -------------------------------------------------------------
  // VISTA DE CHECKOUT
  // -------------------------------------------------------------
  if (pantallaCheckout) {
    return (
      <div className="w-100 min-vh-100 bg-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div className="row g-0 min-vh-100">
          <div className="col-lg-7 p-4 p-md-5">
            <div style={{ maxWidth: '600px' }} className="mx-auto w-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold m-0" style={{ letterSpacing: '2px', fontSize: '1.2rem' }}>
                  SU MEJOR ESENCIA <span className="fw-light text-muted fs-6">COSTA RICA</span>
                </h3>
                <button className="btn btn-link text-dark text-decoration-none small" onClick={volverDeCheckout}>
                  ← Volver a la tienda
                </button>
              </div>

              <form onSubmit={procesarPago}>
                <div className="mb-4">
                  <h6 className="fw-bold mb-2 small text-uppercase">Contacto</h6>
                  <input type="email" name="correo" className="form-control py-2" placeholder="Correo electrónico" required value={formData.correo} onChange={handleInputChange} />
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3 small text-uppercase">Entrega en Costa Rica</h6>
                  <div className="row g-2 mb-2">
                    <div className="col-6"><input type="text" name="nombre" className="form-control py-2" placeholder="Nombre" required value={formData.nombre} onChange={handleInputChange} /></div>
                    <div className="col-6"><input type="text" name="apellidos" className="form-control py-2" placeholder="Apellidos" required value={formData.apellidos} onChange={handleInputChange} /></div>
                  </div>
                  <div className="mb-2"><input type="text" name="direccion" className="form-control py-2" placeholder="Dirección exacta o señas" required value={formData.direccion} onChange={handleInputChange} /></div>
                  <div className="row g-2 mb-2">
                    <div className="col-4">
                      <select name="provincia" className="form-select py-2" value={formData.provincia} onChange={handleInputChange}>
                        <option value="San José">San José</option><option value="Alajuela">Alajuela</option><option value="Cartago">Cartago</option><option value="Heredia">Heredia</option><option value="Puntarenas">Puntarenas</option><option value="Limón">Limón</option><option value="Guanacaste">Guanacaste</option>
                      </select>
                    </div>
                    <div className="col-4"><input type="text" name="canton" className="form-control py-2" placeholder="Cantón" required value={formData.canton} onChange={handleInputChange} /></div>
                    <div className="col-4"><input type="text" name="distrito" className="form-control py-2" placeholder="Distrito" required value={formData.distrito} onChange={handleInputChange} /></div>
                  </div>
                  <input type="tel" name="telefono" className="form-control py-2" placeholder="Teléfono / WhatsApp" required value={formData.telefono} onChange={handleInputChange} />
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-2 small text-uppercase">Método de Pago</h6>
                  <div className="border rounded-3">
                    <div className={`p-3 border-bottom ${metodoPago === 'tarjeta' ? 'bg-light' : ''}`}>
                      <div className="form-check m-0">
                        <input className="form-check-input" type="radio" name="metodoPago" id="p1" checked={metodoPago === 'tarjeta'} onChange={() => setMetodoPago('tarjeta')} />
                        <label className="form-check-label fw-semibold ms-2" htmlFor="p1">Tarjeta de Crédito / Débito</label>
                      </div>
                      {metodoPago === 'tarjeta' && (
                        <div className="mt-3 pt-2 border-top">
                          <input type="text" name="numeroTarjeta" className="form-control py-2 mb-2" placeholder="Número de tarjeta" value={formData.numeroTarjeta} onChange={handleInputChange} />
                          <div className="row g-2">
                            <div className="col-6"><input type="text" name="expiracion" className="form-control py-2" placeholder="MM/AA" value={formData.expiracion} onChange={handleInputChange} /></div>
                            <div className="col-6"><input type="password" name="cvv" className="form-control py-2" placeholder="CVV" maxLength="4" value={formData.cvv} onChange={handleInputChange} /></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-3 ${metodoPago === 'sinpe' ? 'bg-light' : ''}`}>
                      <div className="form-check m-0">
                        <input className="form-check-input" type="radio" name="metodoPago" id="p2" checked={metodoPago === 'sinpe'} onChange={() => setMetodoPago('sinpe')} />
                        <label className="form-check-label fw-semibold ms-2" htmlFor="p2">SINPE Móvil / Transferencia</label>
                      </div>
                      {metodoPago === 'sinpe' && (
                        <div className="p-3 bg-white border rounded-3 mt-3">
                          <p className="small mb-1 fw-bold text-dark">Datos para transferir por SINPE Móvil:</p>
                          <div className="bg-light p-2 rounded mb-2">
                            <div className="small">Número: <strong>8888-8888</strong></div>
                            <div className="small">A nombre de: <strong>Su Mejor Esencia CR</strong></div>
                          </div>
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                            Monto exacto a transferir: <strong>₡{totalGeneral.toLocaleString()}</strong>.
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-dark w-100 py-3 fw-bold rounded-pill">
                  {metodoPago === 'sinpe' ? 'Confirmar Pedido por SINPE Móvil' : `Pagar ₡${totalGeneral.toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-5 p-4 p-md-5 border-start" style={{ backgroundColor: '#F7F4EE' }}>
            <div style={{ maxWidth: '400px' }} className="mx-auto">
              
              {/* LISTA DE ITEMS EN CHECKOUT */}
              <div className="mb-4">
                {carrito.map(item => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <img src={item.imagen} alt={item.nombre} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      <div>
                        <div className="fw-bold small">{item.nombre}</div>
                        <small className="text-muted">x{item.cantidad}</small>
                      </div>
                    </div>
                    <span className="fw-semibold small">₡{(item.precio * item.cantidad).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* SECCIÓN DE CUPÓN DE DESCUENTO */}
              <div className="mb-4 pt-3 border-top">
                <label className="form-label small fw-bold text-uppercase">Cupón de Descuento</label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control form-control-sm text-uppercase" 
                    placeholder="Ej. BIENVENIDA10"
                    value={codigoCupon}
                    onChange={(e) => setCodigoCupon(e.target.value)}
                  />
                  <button className="btn btn-dark btn-sm fw-bold" type="button" onClick={validarCupon}>Aplicar</button>
                </div>
                {mensajeCupon.texto && (
                  <small className={`d-block mt-1 text-${mensajeCupon.tipo}`} style={{ fontSize: '0.75rem' }}>
                    {mensajeCupon.texto}
                  </small>
                )}
              </div>

              {/* DESGLOSE DE TOTALES */}
              <div className="py-3 border-top border-bottom mb-3">
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Subtotal</span>
                  <span>₡{subtotalBase.toLocaleString()}</span>
                </div>
                {descuentoAplicado > 0 && (
                  <div className="d-flex justify-content-between mb-2 small text-success fw-bold">
                    <span>Descuento ({descuentoAplicado}%)</span>
                    <span>-₡{montoDescuento.toLocaleString()}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small text-secondary">
                  <span>Envío (Correos de Costa Rica / Pymexpress)</span>
                  <span>₡{costoEnvio.toLocaleString()}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-baseline">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-3">₡{totalGeneral.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VISTA PRINCIPAL
  // -------------------------------------------------------------
  return (
    <div className="w-100 min-vh-100 m-0 p-0 overflow-x-hidden" style={{ backgroundColor: '#F7F4EE', color: '#1A1A1A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* BARRA SUPERIOR */}
      <div className="w-100 text-center py-2 text-white fw-semibold" style={{ backgroundColor: '#111111', fontSize: '0.75rem', letterSpacing: '0.8px' }}>
        🚚 ENVÍOS A TODO COSTA RICA CON CORREOS DE COSTA RICA & PYMEXPRESS
      </div>

      {/* NAVBAR */}
      <nav className="w-100 bg-white border-bottom px-4 px-lg-5 py-3 sticky-top">
        <div className="w-100 d-flex justify-content-between align-items-center">
          <a className="navbar-brand fw-bold text-dark m-0" href="#" style={{ letterSpacing: '2px', fontSize: '1.1rem' }}>
            SU MEJOR ESENCIA <span className="fw-light text-muted fs-6">PERFUMES CR</span>
          </a>

          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-link text-dark position-relative p-0 border-0"
              onClick={() => mostrarCarrito ? cerrarCarritoModal() : abrirCarritoModal()}
            >
              <i className="bi bi-bag fs-5"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-black text-white" style={{ fontSize: '0.55rem' }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* CARRITO DESPLEGABLE */}
      {mostrarCarrito && (
        <div className="position-fixed top-0 end-0 m-4 bg-white rounded-4 shadow-lg p-4 border" style={{ zIndex: 1060, width: '360px', maxWidth: '90vw' }}>
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h6 className="fw-bold m-0">Carrito de Compras</h6>
            <button className="btn-close" onClick={cerrarCarritoModal}></button>
          </div>
          {carrito.length === 0 ? (
            <p className="text-muted small text-center my-4">Tu carrito está vacío.</p>
          ) : (
            <div>
              <div className="mb-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {carrito.map(item => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <img src={item.imagen} alt={item.nombre} className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                      <div>
                        <div className="fw-bold small">{item.nombre}</div>
                        <small className="text-muted">₡{item.precio.toLocaleString()}</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary py-0 px-2" onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                        <span className="btn btn-light disabled py-0 px-2 text-dark fw-bold">{item.cantidad}</span>
                        <button className="btn btn-outline-secondary py-0 px-2" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 mb-3">
                <span className="fw-bold">Subtotal</span>
                <span className="fw-bold fs-5">₡{subtotalBase.toLocaleString()}</span>
              </div>
              <button 
                className="btn w-100 py-2 text-white fw-bold rounded-pill shadow-sm" 
                style={{ backgroundColor: '#A84C23' }}
                onClick={irAlCheckout}
              >
                Proceder al Pago →
              </button>
            </div>
          )}
        </div>
      )}

      {/* CATÁLOGO Y FILTROS */}
      <section id="catalogo" className="w-100 py-5 px-4 px-lg-5">
        <div className="text-center mb-4">
          <span className="text-uppercase fw-semibold d-block mb-1" style={{ color: '#B25D38', letterSpacing: '1.5px', fontSize: '0.7rem' }}>
            COLECCIÓN EXCLUSIVA
          </span>
          <h2 className="fw-bold mb-3 text-dark" style={{ fontSize: '2rem' }}>Catálogo Su Mejor Esencia</h2>

          {/* BUSCADOR */}
          <div className="mx-auto mb-4" style={{ maxWidth: '400px' }}>
            <input 
              type="text" 
              className="form-control rounded-pill px-4 py-2 border-0 bg-white shadow-sm text-center small"
              placeholder="Buscar por perfume, marca o notas olfativas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* BARRA DE FILTROS POR CATEGORÍA / FAMILIA OLFATIVA */}
          <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
            {['Todos', 'Árabes', 'Amaderados', 'Frescos', 'Dulces', 'Nicho'].map(cat => (
              <button
                key={cat}
                className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold transition-all ${
                  categoriaFiltro === cat 
                    ? 'btn-dark text-white shadow-sm' 
                    : 'btn-outline-secondary bg-white text-dark border-0 shadow-sm'
                }`}
                style={{ fontSize: '0.75rem' }}
                onClick={() => setCategoriaFiltro(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status"></div>
            <p className="text-muted small mt-2">Cargando fragancias...</p>
          </div>
        ) : (
          <div className="row g-4 w-100 m-0 justify-content-center">
            {productosFiltrados.map(prod => {
              const estaAgotado = prod.stock <= 0;
              const ultimasUnidades = prod.stock > 0 && prod.stock <= 3;

              return (
                <div className="col-6 col-md-4 col-lg-3" key={prod.id}>
                  <div className="h-100 bg-white p-3 rounded-3 border-0 text-center d-flex flex-column justify-content-between shadow-sm position-relative">
                    
                    {/* INSIGNIAS DE STOCK AUTOMÁTICO */}
                    {estaAgotado ? (
                      <span className="position-absolute top-0 start-0 m-3 badge bg-danger text-uppercase" style={{ fontSize: '0.6rem' }}>
                        Agotado
                      </span>
                    ) : ultimasUnidades ? (
                      <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark text-uppercase" style={{ fontSize: '0.6rem' }}>
                        ¡Últimas {prod.stock} unids!
                      </span>
                    ) : null}

                    <div>
                      <img src={prod.imagen} alt={prod.nombre} className="img-fluid rounded mb-3" style={{ height: '160px', objectFit: 'contain', width: '100%', opacity: estaAgotado ? 0.5 : 1 }} />
                      <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.65rem' }}>{prod.marca}</small>
                      <h6 className="fw-bold text-dark mt-1 mb-2" style={{ fontSize: '0.85rem' }}>{prod.nombre}</h6>
                    </div>

                    <div>
                      <p className="fw-bold text-dark mb-2" style={{ fontSize: '0.9rem' }}>₡{prod.precio.toLocaleString()}</p>
                      
                      <button 
                        className={`btn btn-sm w-100 rounded-pill fw-semibold py-1 mb-2 ${estaAgotado ? 'btn-secondary disabled' : 'btn-dark'}`}
                        style={{ fontSize: '0.75rem' }}
                        disabled={estaAgotado}
                        onClick={() => agregarAlCarrito(prod)}
                      >
                        {estaAgotado ? 'Sin Stock' : 'Añadir Botella (100ml)'}
                      </button>

                      {prod.decant_precio && (
                        <button 
                          className="btn btn-outline-secondary btn-sm w-100 rounded-pill fw-semibold py-1"
                          style={{ fontSize: '0.7rem' }}
                          onClick={() => agregarAlCarrito(prod, true)}
                        >
                          + Decant 2ml (₡{prod.decant_precio.toLocaleString()})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="w-100 bg-white border-top text-center py-4 mt-5 px-4">
        <p className="mb-0 small text-muted">© 2026 SU MEJOR ESENCIA CR. Todos los derechos reservados.</p>
      </footer>

    </div>
  );
}