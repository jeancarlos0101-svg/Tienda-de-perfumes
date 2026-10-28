import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Tienda from './pages/Tienda';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Tienda />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}