import React, { useState, useEffect } from 'react';

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [faseCheckout, setFaseCheckout] = useState('CARRITO');
  
  // Nuevo Estado para la Vista de Detalle del Producto (Estilo de la imagen de referencia)
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState('100ml');
  const [cantidadDetalle, setCantidadDetalle] = useState(1);

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('TODOS');

  // Formulario Checkout
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [direccion, setDireccion] = useState('');
  const [provincia, setProvincia] = useState('San José');
  const [canton, setCanton] = useState('');
  const [distrito, setDistrito] = useState('');
  const [telefono, setTelefono] = useState('');
  const [metodoPago, setMetodoPago] = useState('SINPE_MOVIL');
  const [comprobante, setComprobante] = useState('');
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);

  const costoEnvio = 2900;

  useEffect(() => {
    fetch('http://localhost:5000/api/productos')
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar');
        return res.json();
      })
      .then((data) => {
        // Enriquecemos los productos con datos de notas y acordes simulados para el estilo de autor
        const enriquecidos = data.map((p, idx) => ({
          ...p,
          stockDisponible: idx === 0 ? 3 : 8,
          historia: p.descripcion || "Lanzamiento exclusivo de autor con un perfil amaderado especiado, ámbar y notas profundas que realzan la elegancia en la piel.",
          comoHuele: "Abre con notas chispeantes y especiadas. En el corazón se perciben acordes resinosos y ligeramente ahumados sin volverse pesados, asentándose en un fondo cálido, limpio y cremoso.",
          acordes: [
            { nombre: 'Ámbar', porcentaje: '95%', color: '#C5A880' },
            { nombre: 'Cálido especiado', porcentaje: '85%', color: '#D9822B' },
            { nombre: 'Aromático', porcentaje: '65%', color: '#2D6A4F' },
            { nombre: 'Amaderado', porcentaje: '50%', color: '#6F4E37' }
          ]
        }));
        setProductos(enriquecidos);
      })
      .catch((err) => {
        console.error('Error cargando productos:', err);
      });
  }, []);

  const agregarAlCarritoConCantidad = (producto, cantidad = 1, tamano = '100ml') => {
    setCarrito((prev) => {
      const idUnico = `${producto.id}-${tamano}`;
      const existe = prev.find((item) => item.idUnico === idUnico);
      if (existe) {
        return prev.map((item) =>
          item.idUnico === idUnico ? { ...item, cantidad: item.cantidad + cantidad } : item
        );
      }
      return [...prev, { ...producto, idUnico, cantidad, tamano, precio: tamano === 'Decant 10ml' ? Math.round(producto.precio * 0.35) : producto.precio }];
    });
    setMostrarModal(true);
    setFaseCheckout('CARRITO');
  };

  const cambiarCantidadCarrito = (idUnico, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.idUnico === idUnico) {
            const nuevaCantidad = item.cantidad + delta;
            return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const eliminarDelCarrito = (idUnico) => {
    setCarrito((prev) => prev.filter((item) => item.idUnico !== idUnico));
  };

  const aplicarCupón = () => {
    if (codigoDescuento.toUpperCase() === 'DESCUENTO10') {
      setDescuentoAplicado(0.10);
      alert('¡Cupón del 10% aplicado correctamente!');
    } else {
      alert('Código de descuento no válido.');
    }
  };

  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto = 
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (prod.descripcion && prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()));
    if (filtroCategoria === 'OFERTAS') return coincideTexto && prod.precio < 25000;
    return coincideTexto;
  });

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotalPrecio = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const montoDescuento = subtotalPrecio * descuentoAplicado;
  const totalPrecio = subtotalPrecio - montoDescuento + (carrito.length > 0 ? costoEnvio : 0);

  const productoDestacado = productos[0] || {
    id: 999,
    nombre: 'Vantage',
    precio: 29000,
    descripcion: 'Aroma amaderado intenso con notas especiadas de cuero y ámbar.',
    imagen: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600',
    stockDisponible: 3,
    historia: 'Vantage es el lanzamiento exclusivo de perfil amaderado especiado.',
    comoHuele: 'Abre con notas chispeantes.',
    acordes: [{ nombre: 'Ámbar', porcentaje: '95%', color: '#C5A880' }]
  };

  const procesarCompra = (e) => {
    e.preventDefault();
    alert('¡Gracias por tu compra! Pedido registrado con éxito.');
    setCarrito([]);
    setMostrarModal(false);
    setFaseCheckout('CARRITO');
  };

  return (
    <div style={{ backgroundColor: '#F4F6F4', minHeight: '100vh', color: '#1E2A24', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <style>{`
        .hero-banner-botanical { background: linear-gradient(135deg, #2D3A34 0%, #1E2A24 100%); color: #F4F6F4; }
        .badge-olive { background-color: #C5A880; color: #1E2A24; font-size: 0.7rem; letter-spacing: 2px; padding: 5px 14px; font-weight: 700; text-transform: uppercase; }
        .product-card-custom { background: #FFFFFF; border: 1px solid #DCE3DE; border-radius: 4px; transition: all 0.3s ease; cursor: pointer; }
        .product-card-custom:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(45, 58, 52, 0.08); border-color: #2D3A34; }
        .btn-olive { background-color: #2D3A34; color: #F4F6F4; border: 1px solid #2D3A34; border-radius: 4px; padding: 10px 24px; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; transition: all 0.2s ease; }
        .btn-olive:hover { background-color: #3F5148; color: #FFFFFF; }
        .btn-outline-olive { border: 1px solid #2D3A34; color: #2D3A34; background-color: transparent; border-radius: 4px; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; }
        .nav-link-btn { background: none; border: none; color: #555; font-weight: 600; cursor: pointer; }
        .shopify-input { border: 1px solid #DCE3DE; border-radius: 8px; padding: 10px 14px; font-size: 0.9rem; }
        .payment-option-card { border: 1px solid #DCE3DE; border-radius: 10px; padding: 14px 18px; cursor: pointer; transition: all 0.2s; }
        .payment-option-card.selected { border-color: #000000; background-color: #FBFBFB; box-shadow: inset 0 0 0 1px #000000; }
        .size-pill { border: 1px solid #DCE3DE; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; background: #fff; transition: all 0.2s; }
        .size-pill.active { border-color: #2D3A34; background-color: #2D3A34; color: #fff; font-weight: 600; }
      `}</style>

      {/* Navegación Superior */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top" style={{ borderColor: '#DCE3DE' }}>
        <div className="container">
          <span className="navbar-brand fw-bold fs-4 text-dark" style={{ letterSpacing: '3px', cursor: 'pointer' }} onClick={() => { setProductoSeleccionado(null); setFiltroCategoria('TODOS'); }}>
            BOTANICA & CO.
          </span>

          <div className="d-none d-md-flex align-items-center gap-4 small" style={{ letterSpacing: '1px' }}>
            <button className="nav-link-btn" onClick={() => { setProductoSeleccionado(null); setFiltroCategoria('TODOS'); }}>Novedades</button>
            <button className="nav-link-btn" onClick={() => { setProductoSeleccionado(null); window.scrollTo({ top: 600, behavior: 'smooth' }); }}>Colección Botánica</button>
            <button className="nav-link-btn text-danger" onClick={() => { setProductoSeleccionado(null); setFiltroCategoria('OFERTAS'); }}>Ofertas Especiales</button>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-dark border-0 position-relative p-2" onClick={() => { setMostrarModal(true); setFaseCheckout('CARRITO'); }}>
              🛒
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle" style={{ backgroundColor: '#2D3A34' }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* VISTA CONDICIONAL: DETALLE DE PRODUCTO O TIENDA GENERAL */}
      {productoSeleccionado ? (
        /* VISTA DETALLE DE PRODUCTO (Estilo Imagen Referencia[cite: 4]) */
        <div className="container py-5">
          <nav className="small text-muted mb-4">
            <span style={{ cursor: 'pointer' }} onClick={() => setProductoSeleccionado(null)}>Inicio</span> &rsaquo; <span>Perfumes</span> &rsaquo; <span className="text-dark fw-semibold">{productoSeleccionado.nombre}</span>
          </nav>

          <div className="row g-5 align-items-start bg-white p-4 p-md-5 rounded-4 shadow-sm border mb-5">
            {/* Imagen del Producto */}
            <div className="col-lg-6 text-center">
              <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} className="img-fluid rounded-3 border" style={{ maxHeight: '480px', objectFit: 'cover', width: '100%' }} />
            </div>

            {/* Información de Compra y Atributos */}
            <div className="col-lg-6">
              <h2 className="fw-bold display-5 mb-1">{productoSeleccionado.nombre} <span className="text-muted fs-5 fw-normal">Rayhaan</span></h2>
              <h3 className="fw-bold mb-3" style={{ color: '#2D3A34' }}>
                ₡{tamanoSeleccionado === 'Decant 10ml' ? (Math.round(productoSeleccionado.precio * 0.35)).toLocaleString() : productoSeleccionado.precio.toLocaleString()}
              </h3>
              
              {/* Alerta de Urgencia / Stock */}
              {productoSeleccionado.stockDisponible <= 3 && (
                <p className="text-danger small fw-bold mb-4">
                  <i className="bi bi-fire me-1"></i> ¡Apresúrate! Solo quedan {productoSeleccionado.stockDisponible} disponibles[cite: 4]
                </p>
              )}

              {/* Selector de Tamaño */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-uppercase text-muted">Tamaño</label>
                <div className="d-flex gap-2">
                  <div className={`size-pill ${tamanoSeleccionado === '100ml' ? 'active' : ''}`} onClick={() => setTamanoSeleccionado('100ml')}>
                    100ml <br/><small>₡{productoSeleccionado.precio.toLocaleString()}</small>
                  </div>
                  <div className={`size-pill ${tamanoSeleccionado === 'Decant 10ml' ? 'active' : ''}`} onClick={() => setTamanoSeleccionado('Decant 10ml')}>
                    Decant 10ml <br/><small>₡{(Math.round(productoSeleccionado.precio * 0.35)).toLocaleString()}</small>
                  </div>
                </div>
              </div>

              {/* Cantidad y Botón Añadir */}
              <div className="row g-2 align-items-center mb-4">
                <div className="col-4">
                  <div className="input-group shopify-input">
                    <button className="btn btn-outline-secondary border-0 btn-sm" onClick={() => setCantidadDetalle(Math.max(1, cantidadDetalle - 1))}>-</button>
                    <input type="text" className="form-control text-center bg-transparent border-0 shadow-none" value={cantidadDetalle} readOnly />
                    <button className="btn btn-outline-secondary border-0 btn-sm" onClick={() => setCantidadDetalle(cantidadDetalle + 1)}>+</button>
                  </div>
                </div>
                <div className="col-8">
                  <button className="btn btn-olive w-100 py-3 fw-bold rounded-3 shadow-sm" onClick={() => agregarAlCarritoConCantidad(productoSeleccionado, cantidadDetalle, tamanoSeleccionado)}>
                    Añadir al carrito
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="row text-center pt-3 border-top g-2 small text-muted">
                <div className="col-4">🛡️ 100% original[cite: 4]</div>
                <div className="col-4">🚚 Envío gratis desde ₡45.000[cite: 4]</div>
                <div className="col-4">⚡ Entrega en 1-3 días[cite: 4]</div>
              </div>
            </div>
          </div>

          {/* Sección de Storytelling e Historia del Perfume */}
          <div className="row g-5 bg-white p-4 p-md-5 rounded-4 shadow-sm border">
            <div className="col-lg-7">
              <p className="text-muted lh-lg mb-4">{productoSeleccionado.historia}</p>
              <h5 className="fw-bold text-dark mb-2">¿Cómo huele {productoSeleccionado.nombre}?</h5>
              <p className="text-muted lh-lg">{productoSeleccionado.comoHuele}</p>
            </div>

            {/* Gráfica de Acordes Principales (Estilo Barra Horizontal de la referencia[cite: 4]) */}
            <div className="col-lg-5 ps-lg-5 border-start">
              <h6 className="text-uppercase small fw-bold text-muted mb-3" style={{ letterSpacing: '1px' }}>Acordes principales[cite: 4]</h6>
              <div className="d-flex flex-column gap-2">
                {productoSeleccionado.acordes.map((acorde, idx) => (
                  <div key={idx}>
                    <div className="d-flex justify-content-between small mb-1 fw-semibold text-dark">
                      <span>{acorde.nombre}</span>
                    </div>
                    <div className="progress" style={{ height: '22px', borderRadius: '4px', backgroundColor: '#EFEAE1' }}>
                      <div className="progress-bar text-start ps-2 small fw-bold text-white shadow-none" role="progressbar" style={{ width: acorde.porcentaje, backgroundColor: acorde.color }}>
                        {acorde.porcentaje}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA DE CATALOGO GENERAL Y HERO */
        <div>
          <div className="hero-banner-botanical py-5 border-bottom" style={{ borderColor: '#26332C' }}>
            <div className="container py-4">
              <div className="row align-items-center g-4">
                <div className="col-lg-5">
                  <span className="badge-olive mb-3 d-inline-block">LANZAMIENTO EXCLUSIVO</span>
                  <h1 className="fw-light display-4 mb-3" style={{ letterSpacing: '1px' }}>{productoDestacado.nombre}</h1>
                  <p className="text-white-50 mb-4" style={{ lineHeight: '1.7' }}>{productoDestacado.descripcion}</p>
                  <h3 className="fw-normal mb-4" style={{ color: '#C5A880' }}>₡{productoDestacado.precio.toLocaleString()}</h3>
                  
                  <div className="d-flex align-items-center gap-3">
                    <button className="btn btn-olive" onClick={() => setProductoSeleccionado(productoDestacado)}>
                      Ver Detalles y Comprar
                    </button>
                  </div>
                </div>

                <div className="col-lg-7 text-center position-relative">
                  <img src={productoDestacado.imagen} alt={productoDestacado.nombre} className="img-fluid shadow-lg rounded-3" style={{ maxHeight: '380px', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="container py-5" id="catalogo">
            <div className="text-center mb-5">
              <span className="text-uppercase small fw-bold text-muted tracking-widest" style={{ letterSpacing: '2px' }}>Curaduría de Autor</span>
              <h2 className="fw-normal mt-1 display-6">Colección Disponible</h2>

              <div className="mx-auto mt-4" style={{ maxWidth: '420px' }}>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-0 bg-white border px-3 py-2 shadow-sm"
                  placeholder="Buscar por aroma o notas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
              {productosFiltrados.map((prod) => (
                <div className="col" key={prod.id}>
                  <div className="product-card-custom h-100 p-3 d-flex flex-column position-relative" onClick={() => setProductoSeleccionado(prod)}>
                    <img src={prod.imagen} alt={prod.nombre} className="w-100 mb-3 rounded-2" style={{ height: '210px', objectFit: 'cover' }} />
                    <h6 className="fw-bold mb-1 text-dark">{prod.nombre}</h6>
                    <p className="text-muted small flex-grow-1">{prod.descripcion}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <span className="fw-semibold text-dark">₡{prod.precio.toLocaleString()}</span>
                      <span className="btn btn-sm btn-outline-olive px-3 py-1">Ver detalles</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante de WhatsApp */}
      <a href="https://wa.me/50688888888" className="whatsapp-float" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '25px', left: '25px', backgroundColor: '#25D366', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', zIndex: '1000' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.012-.305.087-.403.089-.088.196-.232.295-.348.098-.117.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.078.38-.058 1.17-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.379-.232z"/>
        </svg>
      </a>

      {/* MODAL CHECKOUT SHOPIFY 2 COLUMNAS */}
      {mostrarModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className={`modal-dialog modal-dialog-centered ${faseCheckout === 'CHECKOUT' ? 'modal-xl' : 'modal-md'}`}>
            <div className="modal-content border-0 shadow-lg overflow-hidden" style={{ borderRadius: '16px' }}>
              
              {faseCheckout === 'CARRITO' && (
                <div className="p-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold m-0">Bolsa de Compras ({totalItems})</h5>
                    <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
                  </div>
                  {carrito.length === 0 ? (
                    <p className="text-muted text-center py-4">Tu bolsa está vacía.</p>
                  ) : (
                    <div>
                      <ul className="list-group list-group-flush mb-3">
                        {carrito.map((item) => (
                          <li key={item.idUnico} className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <div>
                              <h6 className="m-0 fw-semibold">{item.nombre} <small className="text-muted">({item.tamano})</small></h6>
                              <small className="text-muted">₡{item.precio.toLocaleString()} c/u</small>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button className="btn btn-sm btn-outline-secondary px-2" onClick={() => cambiarCantidadCarrito(item.idUnico, -1)}>-</button>
                              <span>{item.cantidad}</span>
                              <button className="btn btn-sm btn-outline-secondary px-2" onClick={() => cambiarCantidadCarrito(item.idUnico, 1)}>+</button>
                              <button className="btn btn-sm text-danger ms-2" onClick={() => eliminarDelCarrito(item.idUnico)}>🗑️</button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="d-flex justify-content-between fw-bold fs-5 mb-3 border-top pt-2">
                        <span>Subtotal:</span>
                        <span>₡{subtotalPrecio.toLocaleString()}</span>
                      </div>
                      <button className="btn btn-olive w-100 py-3 fw-bold" onClick={() => setFaseCheckout('CHECKOUT')}>
                        Proceder al Pago
                      </button>
                    </div>
                  )}
                </div>
              )}

              {faseCheckout === 'CHECKOUT' && (
                <div className="row g-0 bg-white">
                  <div className="col-lg-7 p-4 p-md-5 border-end">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <h4 className="fw-bold m-0">Finalizar Compra</h4>
                      <button className="btn btn-sm btn-link text-muted text-decoration-none" onClick={() => setFaseCheckout('CARRITO')}>
                        &lsaquo; Volver a la bolsa
                      </button>
                    </div>

                    <form onSubmit={procesarCompra}>
                      <div className="mb-4">
                        <label className="form-label small text-muted fw-semibold">Contacto</label>
                        <input type="email" className="form-control shopify-input" placeholder="Correo electrónico" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
                      </div>

                      <div className="mb-4">
                        <label className="form-label small text-muted fw-semibold">Entrega</label>
                        <div className="mb-2">
                          <input type="text" className="form-control shopify-input bg-light" value="Costa Rica" disabled />
                        </div>
                        <div className="row g-2 mb-2">
                          <div className="col-6">
                            <input type="text" className="form-control shopify-input" placeholder="Nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
                          </div>
                          <div className="col-6">
                            <input type="text" className="form-control shopify-input" placeholder="Apellidos" required value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
                          </div>
                        </div>
                        <div className="mb-2">
                          <input type="text" className="form-control shopify-input" placeholder="Dirección de entrega o señas exactas" required value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                        </div>
                        <div className="row g-2 mb-2">
                          <div className="col-4">
                            <select className="form-select shopify-input" value={provincia} onChange={(e) => setProvincia(e.target.value)}>
                              <option>San José</option>
                              <option>Alajuela</option>
                              <option>Cartago</option>
                              <option>Heredia</option>
                              <option>Guanacaste</option>
                              <option>Puntarenas</option>
                              <option>Limón</option>
                            </select>
                          </div>
                          <div className="col-4">
                            <input type="text" className="form-control shopify-input" placeholder="Cantón" required value={canton} onChange={(e) => setCanton(e.target.value)} />
                          </div>
                          <div className="col-4">
                            <input type="text" className="form-control shopify-input" placeholder="Distrito" required value={distrito} onChange={(e) => setDistrito(e.target.value)} />
                          </div>
                        </div>
                        <div>
                          <input type="tel" className="form-control shopify-input" placeholder="Teléfono / WhatsApp (🇨🇷 +506)" required value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label small text-muted fw-semibold">Métodos de envío</label>
                        <div className="payment-option-card selected d-flex justify-content-between align-items-center">
                          <div>
                            <span className="fw-semibold d-block">Costo de envío (1-3 días hábiles)</span>
                            <small className="text-muted">Envíos seguros a todo Costa Rica con tracking</small>
                          </div>
                          <span className="fw-bold">₡{costoEnvio.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label small text-muted fw-semibold">Pago</label>
                        <div className="d-flex flex-column gap-2">
                          <div className={`payment-option-card ${metodoPago === 'SINPE_MOVIL' ? 'selected' : ''}`} onClick={() => setMetodoPago('SINPE_MOVIL')}>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold">📱 SINPE Móvil (Costa Rica)</span>
                              <span className="badge bg-success">Recomendado</span>
                            </div>
                            {metodoPago === 'SINPE_MOVIL' && (
                              <div className="mt-3 pt-3 border-top">
                                <p className="small mb-1">Transferir al número: <strong>8888-8888</strong></p>
                                <label className="form-label extra-small text-muted mb-1"># Comprobante / Referencia Bancaria</label>
                                <input type="text" className="form-control shopify-input" placeholder="Ej: 987654" required value={comprobante} onChange={(e) => setComprobante(e.target.value)} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="btn btn-olive w-100 py-3 fw-bold rounded-3">
                        Pagar ahora (₡{totalPrecio.toLocaleString()})
                      </button>
                    </form>
                  </div>

                  <div className="col-lg-5 p-4 p-md-5" style={{ backgroundColor: '#F9F8F6' }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold m-0">Resumen del pedido</h5>
                      <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
                    </div>

                    <div className="mb-4" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {carrito.map((item) => (
                        <div key={item.idUnico} className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                          <div className="d-flex align-items-center gap-3">
                            <div className="position-relative">
                              <img src={item.imagen} alt={item.nombre} className="rounded-2 border" style={{ width: '55px', height: '55px', objectFit: 'cover' }} />
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-secondary">
                                {item.cantidad}
                              </span>
                            </div>
                            <div>
                              <h6 className="m-0 fw-bold">{item.nombre}</h6>
                              <small className="text-muted">{item.tamano}</small>
                            </div>
                          </div>
                          <span className="fw-semibold">₡{(item.precio * item.cantidad).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex gap-2 mb-4">
                      <input type="text" className="form-control shopify-input" placeholder="Código de descuento" value={codigoDescuento} onChange={(e) => setCodigoDescuento(e.target.value)} />
                      <button type="button" className="btn btn-secondary px-3 rounded-3" onClick={aplicarCupón}>Aplicar</button>
                    </div>

                    <div className="border-top pt-3">
                      <div className="d-flex justify-content-between text-muted mb-2">
                        <span>Subtotal · {totalItems} artículo(s)</span>
                        <span>₡{subtotalPrecio.toLocaleString()}</span>
                      </div>
                      {descuentoAplicado > 0 && (
                        <div className="d-flex justify-content-between text-success mb-2">
                          <span>Descuento aplicado</span>
                          <span>- ₡{montoDescuento.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between text-muted mb-3">
                        <span>Envío</span>
                        <span>₡{costoEnvio.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center pt-3 border-top fs-4 fw-bold">
                        <span>Total</span>
                        <span className="text-dark"><small className="fs-6 text-muted me-1">CRC</small> ₡{totalPrecio.toLocaleString()}</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}