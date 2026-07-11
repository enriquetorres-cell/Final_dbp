import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch, ApiError } from "../api/client";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Crear cuenta</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input name="fullName" className="w-full border rounded px-3 py-2" placeholder="Nombre completo"
          value={form.fullName} onChange={onChange} />
        <input name="username" className="w-full border rounded px-3 py-2" placeholder="Username"
          value={form.username} onChange={onChange} />
        <input name="email" type="email" className="w-full border rounded px-3 py-2" placeholder="Email"
          value={form.email} onChange={onChange} />
        <input name="password" type="password" className="w-full border rounded px-3 py-2" placeholder="Password"
          value={form.password} onChange={onChange} />
        <button disabled={loading} type="submit"
          className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Creando..." : "Registrarse"}
        </button>
        <p className="text-center text-sm">
          Ya tienes cuenta? <Link to="/login" className="text-blue-600">Inicia sesion</Link>
        </p>
      </form>
    </div>
  );
}
