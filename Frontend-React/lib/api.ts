import { Estado } from "./enums"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ==================== PELÍCULAS ====================

export async function getPeliculasCartelera() {
  try {
    const res = await fetch(`${API_URL}/pelicula/cartelera`, { cache: "no-store" })
    if (!res.ok) throw new Error("Error al obtener las películas en cartelera")
    return res.json()
  } catch (error) {
    console.error("Error en getPeliculasCartelera:", error)
    throw error
  }
}

export async function getPeliculasDestacadas() {
  try {
    const res = await fetch(`${API_URL}/pelicula/cartelera`, { cache: "no-store" })
    if (!res.ok) throw new Error("Error al obtener películas destacadas")
    const data = await res.json()

    const estrenos = data.filter((p: any) => p.estado === Estado.ESTRENO)
    if (estrenos.length > 0) {
      return estrenos
    } else {
      const disponibles = data
        .filter((p: any) => p.estado === Estado.DISPONIBLE)
        .sort((a: any, b: any) => new Date(b.fechaEstreno).getTime() - new Date(a.fechaEstreno).getTime())
        .slice(0, 3)
      return disponibles
    }
  } catch (error) {
    console.error("Error en getPeliculasDestacadas:", error)
    throw error
  }
}

export async function getProximosEstrenos() {
  try {
    const res = await fetch(`${API_URL}/pelicula/cartelera`, { cache: "no-store" })
    if (!res.ok) throw new Error("Error al obtener las películas en cartelera")
    const data = await res.json()
    return data.filter((pelicula: any) => pelicula.estado === Estado.PROXIMAMENTE)
  } catch (error) {
    console.error("Error en getProximosEstrenos:", error)
    throw error
  }
}

// ==================== USUARIOS Y AUTENTICACIÓN ====================

export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMsg = errorData?.error || "Error al intentar iniciar sesión."
    throw new Error(errorMsg)
  }

  const data = await response.json()
  return data.token
}

export async function createUser(data: any) {
  try {
    const response = await fetch(`${API_URL}/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (errorData && typeof errorData === 'object') {
        throw errorData;
      }
      const errorMsg = errorData || "Error al registrar el usuario.";
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error: any) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
    }
    throw error;
  }
}

export async function createAdmin(data: { username: string; password: string; email: string; telefono: string; nombre: string }, token: string) {
  try {
    const response = await fetch(`${API_URL}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (errorData && typeof errorData === 'object') {
        throw errorData; // 🔥 Devuelve objeto de errores como {username: "...", email: "..."}
      }
      const errorMsg = errorData || "Error al registrar el administrador.";
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error: any) {
    if (error.message === "Failed to fetch") {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión.");
    }
    throw error;
  }
}

export async function getUserProfile(token: string) {
  const response = await fetch(`${API_URL}/userLogin`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el perfil del usuario");
  }

  return await response.json();
}

export async function checkUserExists(username: string): Promise<boolean> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/personaExiste/${username}`);
  if (!response.ok) {
    throw new Error("No se pudo verificar el usuario");
  }
  return await response.json();
}
