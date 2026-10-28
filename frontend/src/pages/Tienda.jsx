import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [busqueda, setBusqueda] = useState('');

  // Ejemplo de productos de la tienda
  const productos = [
    {
      id: 1,
      nombre: "Vantage",
      categoria: "Lanzamiento Exclusivo",
      descripcion: "Aroma amaderado intenso con notas especiadas de cuero y ámbar.",
      precio: "₡29.000",
      imagen: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      nombre: "Sigilo Noir",
      categoria: "Colección Botánica",
      descripcion: "Notas profundas de tabaco, vainilla negra y maderas nobles.",
      precio: "₡34.500",
      imagen: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      nombre: "Penumbra Extrait",
      categoria: "Colección Botánica",
      descripcion: "Acordes orientales y misteriosos con una fijación prolongada.",
      precio: "₡38.000",
      imagen: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      
      {/* 1. BARRA DE NAVEGACIÓN */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4 shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold tracking-wider" href="#" style={{ letterSpacing: '2px' }}>
            BOTANICA & CO.
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav gap-3">
              <li className="nav-item"><a className="nav-link active" href="#">Novedades</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Colección Botánica</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Ofertas Especiales</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 2. SECCIÓN DE LANZAMIENTO EXCLUSIVO (Banner principal corregido) */}
      <header className="container my-5">
        <div className="p-4 p-md-5 rounded-4 text-white shadow-lg" style={{ backgroundColor: '#1a2e26' }}>
          <div className="row align-items-center">
            
            {/* Columna de Texto */}
            <div className="col-lg-7 mb-4 mb-lg-0">
              <span className="badge bg-warning text-dark mb-3 px-3 py-2 fw-bold text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>
                Lanzamiento Exclusivo
              </span>
              <h1 className="display-4 fw-bold mb-3">Vantage</h1>
              <p className="lead text-light mb-4" style={{ opacity: 0.9 }}>
                Aroma amaderado intenso con notas especiadas de cuero y ámbar. Una creación pensada para el lujo silencioso.
              </p>
              <div className="d-flex align-items-center gap-4 flex-wrap">
                <span className="fs-3 fw-bold text-warning">₡29.000</span>
                <button className="btn btn-light text-dark fw-bold px-4 py-2 rounded-pill shadow-sm">
                  VER DETALLES Y COMPRAR
                </button>
              </div>
            </div>

            {/* Columna de Imagen */}
            <div className="col-lg-5 text-center">
              <img 
                src="https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80" 
                alt="Vantage Perfume" 
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
              />
            </div>

          </div>
        </div>
      </header>

      {/* 3. SECCIÓN DE COLECCIÓN DISPONIBLE Y BUSCADOR */}
      <main className="container mb-5 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h2 className="fw-bold m-0" style={{ color: '#1a2e26' }}>Colección Disponible</h2>
          
          <div className="w-100" style={{ maxWidth: '300px' }}>
            <input 
              type="text" 
              className="form-control rounded-pill px-3 py-2 border-secondary"
              placeholder="Buscar por aroma o notas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="row g-4">
          {productosFiltrados.map((producto) => (
            <div className="col-md-4" key={producto.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <img 
                  src={producto.imagen} 
                  className="card-img-top" 
                  alt={producto.nombre} 
                  style={{ height: '250px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column p-4">
                  <span className="text-muted small text-uppercase mb-1" style={{ letterSpacing: '1px' }}>
                    {producto.categoria}
                  </span>
                  <h4 className="fw-bold mb-2">{producto.nombre}</h4>
                  <p className="text-secondary small flex-grow-1">{producto.descripcion}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                    <span className="fw-bold fs-5 text-dark">{producto.precio}</span>
                    <button className="btn btn-outline-dark btn-sm rounded-pill px-3 fw-bold">
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <div className="position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050 }}>
        <a 
          href="https://wa.me/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-success rounded-circle shadow-lg d-flex align-items-center justify-content-center"
          style={{ width: '60px', height: '60px', fontSize: '30px' }}
        >
          <i className="bi bi-whatsapp"></i>
        </a>
      </div>

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <p className="mb-0 small" style={{ opacity: 0.8 }}>
          &copy; 2026 BOTANICA & CO. Todos los derechos reservados. Curaduría de Autor en Costa Rica.
        </p>
      </footer>

    </div>
  );
}

export default App;