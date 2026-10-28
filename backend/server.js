// Al crear un producto (POST)
app.post('/api/productos', (req, res) => {
  const { nombre, precio, descripcion, imagen, stock } = req.body;
  const stockInicial = stock !== undefined ? Number(stock) : 10; // Stock por defecto
  
  const query = `INSERT INTO productos (nombre, precio, descripcion, imagen, stock) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [nombre, precio, descripcion, imagen, stockInicial], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, mensaje: 'Producto creado con éxito' });
  });
});

// Al actualizar un producto (PUT)
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, precio, descripcion, imagen, stock } = req.body;
  
  const query = `UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, imagen = ?, stock = ? WHERE id = ?`;
  db.run(query, [nombre, precio, descripcion, imagen, Number(stock), id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Inventario actualizado con éxito', cambios: this.changes });
  });
});