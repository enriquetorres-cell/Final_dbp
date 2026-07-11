const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function mapError(status: number): string {
  switch (status) {
    case 400: return "Datos invalidos. Revisa el formulario.";
    case 404: return "Recurso no encontrado.";
    case 409: return "Ya existe un registro con esos datos.";
    case 500: return "Error interno del servidor. Intenta mas tarde.";
    default: return "Ocurrio un error inesperado.";
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  let res: Response;
  try {
    res = await fetch(BASE_URL + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: "Bearer " + token } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (e) {
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexion.");
  }

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new ApiError(401, "Sesion expirada. Vuelve a iniciar sesion.");
  }

  if (!res.ok) {
    throw new ApiError(res.status, mapError(res.status));
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
