import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Tienda() {
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [pantallaCheckout, setPantallaCheckout] = useState(false);
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [cupon, setCupon] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);

  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    apellidos: "",
    direccion: "",
    provincia: "San José",
    canton: "",
    distrito: "",
    telefono: "",
    numeroTarjeta: "",
    expitacion: "",
    cvv: "",
    nombreTitular: "",
  });

  const productos = [
    {
      id: 1,
      nombre: "Hawas Lava Gold",
      marca: "Rasasi · 100ml",
      precio: 32000,
      imagen:
        "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
      decantPrecio: 3000,
    },
    {
      id: 2,
      nombre: "Vantage",
      marca: "Rayhaan · 100ml",
      precio: 29000,
      imagen:
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
      decantPrecio: 2500,
    },
    {
      id: 3,
      nombre: "Vanilla 01",
      marca: "Swiss Arabian · 100ml",
      precio: 31000,
      imagen:
        "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
      decantPrecio: 3000,
    },
    {
      id: 4,
      nombre: "Private Key To My Success",
      marca: "Armaf · 100ml",
      precio: 36000,
      imagen:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      decantPrecio: 3500,
    },
  ];

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const agregarAlCarrito = (producto, esDecant = false) => {
    const itemAAgregar = {
      ...producto,
      id: esDecant ? `${producto.id}-decant` : producto.id,
      nombre: esDecant ? `Decant ${producto.nombre} (2ml)` : producto.nombre,
      precio: esDecant ? producto.decantPrecio : producto.precio,
    };

    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === itemAAgregar.id);
      if (existe) {
        return prev.map((item) =>
          item.id === itemAAgregar.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item,
        );
      }
      return [...prev, { ...itemAAgregar, cantidad: 1 }];
    });
    setMostrarCarrito(true);
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nueva = item.cantidad + delta;
            return nueva > 0 ? { ...item, cantidad: nueva } : null;
          }
          return item;
        })
        .filter(Boolean),
    );
  };

  const subtotal = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );
  const costoEnvio = subtotal > 0 ? 2900 : 0;
  const totalGeneral = Math.max(0, subtotal + costoEnvio - descuentoAplicado);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // -------------------------------------------------------------
  // PASARELA DE CHECKOUT
  // -------------------------------------------------------------
  if (pantallaCheckout) {
    return (
      <div
        className="w-100 min-vh-100 bg-white"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <div className="row g-0 min-vh-100">
          <div className="col-lg-7 p-4 p-md-5">
            <div style={{ maxWidth: "600px" }} className="mx-auto w-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3
                  className="fw-bold m-0"
                  style={{ letterSpacing: "2px", fontSize: "1.2rem" }}
                >
                  SU MEJOR ESENCIA{" "}
                  <span className="fw-light text-muted fs-6">COSTA RICA</span>
                </h3>
                <button
                  className="btn btn-link text-dark text-decoration-none small"
                  onClick={() => setPantallaCheckout(false)}
                >
                  ← Volver a la tienda
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("¡Pedido procesado con éxito!");
                }}
              >
                <div className="mb-4">
                  <h6 className="fw-bold mb-2 small text-uppercase">
                    Contacto
                  </h6>
                  <input
                    type="email"
                    name="correo"
                    className="form-control py-2"
                    placeholder="Correo electrónico"
                    required
                    value={formData.correo}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3 small text-uppercase">
                    Entrega en Costa Rica
                  </h6>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        type="text"
                        name="nombre"
                        className="form-control py-2"
                        placeholder="Nombre"
                        required
                        value={formData.nombre}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        name="apellidos"
                        className="form-control py-2"
                        placeholder="Apellidos"
                        required
                        value={formData.apellidos}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      name="direccion"
                      className="form-control py-2"
                      placeholder="Dirección exacta o señas"
                      required
                      value={formData.direccion}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-4">
                      <select
                        name="provincia"
                        className="form-select py-2"
                        value={formData.provincia}
                        onChange={handleInputChange}
                      >
                        <option value="San José">San José</option>
                        <option value="Alajuela">Alajuela</option>
                        <option value="Cartago">Cartago</option>
                        <option value="Heredia">Heredia</option>
                        <option value="Puntarenas">Puntarenas</option>
                        <option value="Limón">Limón</option>
                        <option value="Guanacaste">Guanacaste</option>
                      </select>
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        name="canton"
                        className="form-control py-2"
                        placeholder="Cantón"
                        required
                        value={formData.canton}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        name="distrito"
                        className="form-control py-2"
                        placeholder="Distrito"
                        required
                        value={formData.distrito}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    className="form-control py-2"
                    placeholder="Teléfono / WhatsApp"
                    required
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-2 small text-uppercase">Pago</h6>
                  <div className="border rounded-3">
                    <div
                      className={`p-3 border-bottom ${metodoPago === "tarjeta" ? "bg-light" : ""}`}
                    >
                      <div className="form-check m-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="metodoPago"
                          id="p1"
                          checked={metodoPago === "tarjeta"}
                          onChange={() => setMetodoPago("tarjeta")}
                        />
                        <label
                          className="form-check-label fw-semibold ms-2"
                          htmlFor="p1"
                        >
                          Tarjeta de Crédito / Débito
                        </label>
                      </div>
                    </div>
                    <div
                      className={`p-3 ${metodoPago === "sinpe" ? "bg-light" : ""}`}
                    >
                      <div className="form-check m-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="metodoPago"
                          id="p2"
                          checked={metodoPago === "sinpe"}
                          onChange={() => setMetodoPago("sinpe")}
                        />
                        <label
                          className="form-check-label fw-semibold ms-2"
                          htmlFor="p2"
                        >
                          SINPE Móvil / Transferencia
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100 py-3 fw-bold rounded-pill"
                >
                  Pagar ahora ₡{totalGeneral.toLocaleString()}
                </button>
              </form>
            </div>
          </div>

          <div
            className="col-lg-5 p-4 p-md-5 border-start"
            style={{ backgroundColor: "#F7F4EE" }}
          >
            <div style={{ maxWidth: "400px" }} className="mx-auto">
              <div className="mb-4">
                {carrito.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between mb-3"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="rounded"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div className="fw-bold small">{item.nombre}</div>
                        <small className="text-muted">{item.marca}</small>
                      </div>
                    </div>
                    <span className="fw-semibold small">
                      ₡{(item.precio * item.cantidad).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="py-3 border-top border-bottom mb-3">
                <div className="d-flex justify-content-between mb-2 small text-secondary">
                  <span>Subtotal</span>
                  <span>₡{subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between small text-secondary">
                  <span>Envío (Pymexpress / Correos)</span>
                  <span>₡{costoEnvio.toLocaleString()}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-baseline">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-3">
                  ₡{totalGeneral.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VISTA PRINCIPAL (DISEÑO 100% ANCHO REAL Y SIN BOTÓN ADMIN VISIBLE)
  // -------------------------------------------------------------
  return (
    <div
      className="w-100 min-vh-100 m-0 p-0 overflow-x-hidden"
      style={{
        backgroundColor: "#F7F4EE",
        color: "#1A1A1A",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* BARRA SUPERIOR DE ANUNCIO */}
      <div
        className="w-100 text-center py-2 text-white fw-semibold"
        style={{
          backgroundColor: "#111111",
          fontSize: "0.75rem",
          letterSpacing: "0.8px",
        }}
      >
        🚚 ENVÍOS A TODO COSTA RICA CON CORREOS DE COSTA RICA & PYMEXPRESS
      </div>

      {/* MENÚ DE NAVEGACIÓN SUPERIOR (SIN BOTÓN DE ADMIN) */}
      <nav className="w-100 bg-white border-bottom px-4 px-lg-5 py-3 sticky-top">
        <div className="w-100 d-flex justify-content-between align-items-center">
          <a
            className="navbar-brand fw-bold text-dark m-0"
            href="#"
            style={{ letterSpacing: "2px", fontSize: "1.1rem" }}
          >
            SU MEJOR ESENCIA{" "}
            <span className="fw-light text-muted fs-6">PERFUMES CR</span>
          </a>

          <div
            className="d-none d-lg-flex align-items-center gap-4 text-uppercase"
            style={{
              letterSpacing: "1px",
              fontSize: "0.75rem",
              fontWeight: "500",
            }}
          >
            <a
              href="#catalogo"
              className="text-dark text-decoration-none fw-bold border-bottom border-dark pb-1"
            >
              Lo nuevo*
            </a>
            <a href="#catalogo" className="text-secondary text-decoration-none">
              Perfumes
            </a>
            <a href="#catalogo" className="text-secondary text-decoration-none">
              Decants (Muestras)
            </a>
            <a href="#catalogo" className="text-secondary text-decoration-none">
              Ofertas
            </a>
            <a href="#catalogo" className="text-secondary text-decoration-none">
              Mayorista
            </a>
            <a href="#catalogo" className="text-secondary text-decoration-none">
              Accesorios
            </a>
          </div>

          <div className="d-flex align-items-center gap-3">
            <i
              className="bi bi-search fs-5 text-dark"
              style={{ cursor: "pointer" }}
            ></i>
            <i
              className="bi bi-person fs-5 text-dark"
              style={{ cursor: "pointer" }}
            ></i>
            <button
              className="btn btn-link text-dark position-relative p-0 border-0"
              onClick={() => setMostrarCarrito(!mostrarCarrito)}
            >
              <i className="bi bi-bag fs-5"></i>
              {totalItems > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-black text-white"
                  style={{ fontSize: "0.55rem" }}
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* CARRITO DESPLEGABLE */}
      {mostrarCarrito && (
        <div
          className="position-fixed top-0 end-0 m-4 bg-white rounded-4 shadow-lg p-4 border"
          style={{ zIndex: 1060, width: "360px", maxWidth: "90vw" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <h6 className="fw-bold m-0">Carrito de Compras</h6>
            <button
              className="btn-close"
              onClick={() => setMostrarCarrito(false)}
            ></button>
          </div>
          {carrito.length === 0 ? (
            <p className="text-muted small text-center my-4">
              Tu carrito está vacío.
            </p>
          ) : (
            <div>
              <div
                className="mb-3"
                style={{ maxHeight: "250px", overflowY: "auto" }}
              >
                {carrito.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center justify-content-between py-2 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        className="rounded"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div className="fw-bold small">{item.nombre}</div>
                        <small className="text-muted">
                          ₡{item.precio.toLocaleString()}
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary py-0 px-2"
                          onClick={() => cambiarCantidad(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="btn btn-light disabled py-0 px-2 text-dark fw-bold">
                          {item.cantidad}
                        </span>
                        <button
                          className="btn btn-outline-secondary py-0 px-2"
                          onClick={() => cambiarCantidad(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                      <span className="fw-bold small ms-2">
                        ₡{(item.precio * item.cantidad).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 mb-3">
                <span className="fw-bold">Subtotal</span>
                <span className="fw-bold fs-5">
                  ₡{subtotal.toLocaleString()}
                </span>
              </div>
              <button
                className="btn w-100 py-2 text-white fw-bold rounded-pill shadow-sm"
                style={{ backgroundColor: "#A84C23" }}
                onClick={() => {
                  setMostrarCarrito(false);
                  setPantallaCheckout(true);
                }}
              >
                Proceder al Pago →
              </button>
            </div>
          )}
        </div>
      )}

      {/* HERO BANNER - 100% FIEL A LA REFERENCIA */}
      <section
        className="w-100 py-5 px-4 px-lg-5"
        style={{ backgroundColor: "#F7F4EE" }}
      >
        <div className="container-fluid px-0 py-4">
          <div className="row align-items-center justify-content-center g-4">
            <div className="col-lg-5 text-start ps-lg-5">
              <span
                className="text-uppercase fw-semibold d-block mb-2"
                style={{
                  color: "#B25D38",
                  letterSpacing: "1.2px",
                  fontSize: "0.7rem",
                }}
              >
                NUEVO INGRESO
              </span>
              <h1
                className="fw-bold text-dark mb-1"
                style={{ fontSize: "2.8rem", letterSpacing: "-0.5px" }}
              >
                Hawas Lava Gold
              </h1>
              <p className="text-muted mb-3" style={{ fontSize: "0.95rem" }}>
                Rasasi · 100ml
              </p>
              <h3
                className="fw-bold text-dark mb-4"
                style={{ fontSize: "1.8rem" }}
              >
                ₡32.000
              </h3>

              <div className="d-flex align-items-center gap-4">
                <button
                  className="btn bg-white text-dark rounded-pill px-4 py-2 fw-semibold border shadow-sm"
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => agregarAlCarrito(productos[0])}
                >
                  Comprar
                </button>
                <a
                  href="#catalogo"
                  className="text-primary text-decoration-none fw-semibold"
                  style={{ fontSize: "0.85rem" }}
                >
                  Ver todos los nuevos ingresos &gt;
                </a>
              </div>
            </div>

            <div className="col-lg-6 text-center d-flex align-items-center justify-content-center position-relative">
              <div
                className="position-absolute"
                style={{ top: "-10px", right: "15%" }}
              >
                <span
                  className="badge text-white px-3 py-2 rounded-pill fw-semibold"
                  style={{
                    backgroundColor: "#B25D38",
                    fontSize: "0.65rem",
                    letterSpacing: "0.5px",
                  }}
                >
                  RECIÉN LLEGADO
                </span>
              </div>

              <img
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
                alt="Hawas Lava Gold"
                className="img-fluid"
                style={{
                  maxHeight: "380px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.08))",
                }}
              />

              <div className="ms-4 text-center d-none d-sm-block">
                <div
                  className="mb-1"
                  style={{
                    transform: "rotate(-20deg)",
                    fontSize: "1.2rem",
                    color: "#888",
                  }}
                >
                  ➔
                </div>
                <img
                  src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=300&q=80"
                  alt="Decant Muestra"
                  className="rounded border bg-white p-1 mb-2"
                  style={{
                    width: "40px",
                    height: "90px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => agregarAlCarrito(productos[0], true)}
                />
                <a
                  href="#catalogo"
                  onClick={(e) => {
                    e.preventDefault();
                    agregarAlCarrito(productos[0], true);
                  }}
                  className="text-dark text-decoration-none d-block small fw-semibold"
                  style={{ fontSize: "0.7rem" }}
                >
                  Probalo en
                  <br />
                  <span className="text-decoration-underline">decant &gt;</span>
                </a>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
            <span
              className="rounded-pill bg-dark"
              style={{ width: "30px", height: "3px" }}
            ></span>
            <span
              className="rounded-pill bg-secondary opacity-25"
              style={{ width: "15px", height: "3px" }}
            ></span>
            <span
              className="rounded-pill bg-secondary opacity-25"
              style={{ width: "15px", height: "3px" }}
            ></span>
            <span
              className="rounded-pill bg-secondary opacity-25"
              style={{ width: "15px", height: "3px" }}
            ></span>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE PRODUCTOS */}
      <section id="catalogo" className="w-100 py-5 px-4 px-lg-5">
        <div className="text-center mb-5">
          <span
            className="text-uppercase fw-semibold d-block mb-1"
            style={{
              color: "#B25D38",
              letterSpacing: "1.5px",
              fontSize: "0.7rem",
            }}
          >
            NUEVOS INGRESOS
          </span>
          <h2 className="fw-bold mb-2 text-dark" style={{ fontSize: "2rem" }}>
            Lo nuevo en nuestra tienda
          </h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: "500px" }}>
            Conocé nuestros nuevos ingresos: perfumes originales y sellados,
            recién llegados a Su Mejor Esencia CR.
          </p>

          <div className="mx-auto mt-4" style={{ maxWidth: "350px" }}>
            <input
              type="text"
              className="form-control rounded-pill px-4 py-2 border-0 bg-white shadow-sm text-center small"
              placeholder="Buscar por marca o nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-4 w-100 m-0 justify-content-center">
          {productosFiltrados.map((prod) => (
            <div className="col-6 col-md-4 col-lg-2" key={prod.id}>
              <div className="h-100 bg-white p-3 rounded-3 border-0 text-center d-flex flex-column justify-content-between shadow-sm position-relative">
                <div>
                  <span
                    className="position-absolute top-0 start-0 m-2 badge text-white rounded-pill px-2 py-1"
                    style={{ backgroundColor: "#B25D38", fontSize: "0.6rem" }}
                  >
                    NUEVO
                  </span>
                  <img
                    src={prod.imagen}
                    alt={prod.nombre}
                    className="img-fluid rounded mb-3"
                    style={{
                      height: "160px",
                      objectFit: "contain",
                      width: "100%",
                    }}
                  />
                  <small
                    className="text-muted d-block text-uppercase"
                    style={{ fontSize: "0.65rem" }}
                  >
                    {prod.marca}
                  </small>
                  <h6
                    className="fw-bold text-dark mt-1 mb-2"
                    style={{ fontSize: "0.85rem" }}
                  >
                    {prod.nombre}
                  </h6>
                </div>
                <div>
                  <p
                    className="fw-bold text-dark mb-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    ₡{prod.precio.toLocaleString()}
                  </p>
                  <button
                    className="btn btn-dark btn-sm w-100 rounded-pill fw-semibold py-1"
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => agregarAlCarrito(prod)}
                  >
                    Añadir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHATSAPP FLOTANTE */}
      <div
        className="position-fixed bottom-0 start-0 m-4"
        style={{ zIndex: 1050 }}
      >
        <a
          href="https://wa.me/50688888888"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-success rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{
            width: "48px",
            height: "48px",
            fontSize: "24px",
            backgroundColor: "#25D366",
            borderColor: "#25D366",
          }}
        >
          <i className="bi bi-whatsapp text-white"></i>
        </a>
      </div>

      {/* FOOTER */}
      <footer className="w-100 bg-white border-top text-center py-4 mt-5 px-4">
        <p className="mb-0 small text-muted">
          © 2026 SU MEJOR ESENCIA CR. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
