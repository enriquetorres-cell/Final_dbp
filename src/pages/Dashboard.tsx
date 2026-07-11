import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, ApiError } from "../api/client";

interface Item {
  id: number;
  nombre: string;
  sku: string;
  precio: number;
  stock: number;
  Badge: string;
}

export default function Dashboard() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<{ content: Item[]; totalPages: number }>(
          "/api/products?page=" + page + "&size=10"
        );
        setItems(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Error al cargar.");
      }
    }
    load();
  }, [page]);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  async function handleDelete(id: number) {
    if (!confirm("Seguro que deseas eliminar este registro?")) return;
    try {
      await apiFetch("/api/products/" + id, { method: "DELETE" });
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "No se pudo eliminar.");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/products/new" className="bg-blue-600 text-white px-3 py-1 rounded">Nuevo</Link>
          <button onClick={handleLogout} className="bg-gray-700 text-white px-3 py-1 rounded">Salir</button>
        </div>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {items.length === 0 ? (
        <p className="text-gray-500">No hay registros.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold">{it.nombre}</h2>
              <p className="text-sm text-gray-600">{it.sku}</p>
              <p>S/ {it.precio} - Stock: {it.stock}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-blue-100">{it.Badge}</span>
              <div className="mt-2 flex gap-2">
                <Link to={"/products/" + it.id} className="bg-yellow-500 text-white px-3 py-1 rounded">Editar</Link>
                <button onClick={() => handleDelete(it.id)} className="bg-red-600 text-white px-3 py-1 rounded">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-6">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
        <span>Pagina {page} de {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}
