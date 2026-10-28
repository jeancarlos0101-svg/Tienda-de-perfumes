import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Tienda from './pages/Tienda';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/admin-tienda-perfumes" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}