
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, ApiError } from "../api/client";

export default function CreateProductPage() {
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: 0, stock: 0, imagen: URL });
  const [error, setError] = useState("");
  const navigate = useNavigate();
















  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await apiFetch("/api/products", {
        method: "POST",
        body: JSON.stringify({ ...form, precio: Number(form.precio), stock: Number(form.stock) }),
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al crear.");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Nuevo producto</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="nombre" className="w-full border rounded px-3 py-2" placeholder="Nombre"
          value={form.nombre} onChange={onChange} required />
        <input name="descripcion" className="w-full border rounded px-3 py-2" placeholder="SKU"
          value={form.descripcion} onChange={onChange} required />
        <input name="precio" type="number" className="w-full border rounded px-3 py-2" placeholder="Precio"
          value={form.precio} onChange={onChange} />
        <input name="stock" type="number" className="w-full border rounded px-3 py-2" placeholder="Stock"
          value={form.stock} onChange={onChange} />
        <select name="imagen" className="w-full border rounded px-3 py-2"
          value={form.imagen} onChange={onChange}>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white rounded py-2">Crear</button>
      </form>
    </div>
  );
}
