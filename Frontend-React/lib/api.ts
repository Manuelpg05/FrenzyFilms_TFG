import { Estado } from "./enums"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ==================== CARTELERA ====================

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

// ==================== PELÍCULAS ====================

export async function getPeliculaById(id: string) {
  const res = await fetch(`${API_URL}/pelicula/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Error al obtener la película con ID ${id}`);
  }
  return res.json();
}

export async function getPeliculaBySesionId(idSesion: number, token: string) {
  const res = await fetch(`${API_URL}/pelicula/sesion/${idSesion}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || "No se pudo obtener la película asociada a la sesión";
    throw new Error(msg);
  }

  return res.json();
}


// ==================== SESIONES ====================

export async function getSesionesFuturasPorPelicula(id: string) {
  const res = await fetch(`${API_URL}/sesion/futuras/pelicula/${id}`, { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`Error al obtener las sesiones de la película ${id}`)
  }
  return res.json()
}

export async function getSesionById(id: string) {
  const res = await fetch(`${API_URL}/sesion/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Error al obtener la sesión con ID ${id}`);
  }
  return res.json();
}

export async function getSesionByEntradaId(idEntrada: number, token: string) {
  const res = await fetch(`${API_URL}/sesion/entrada/${idEntrada}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || "No se pudo obtener la sesión asociada a la entrada";
    throw new Error(msg);
  }

  return res.json();
}


// ==================== ENTRADAS ====================

export async function getEntradasUsuarioDetallado(token: string) {
  const res = await fetch(`${API_URL}/entrada/usuario/detallado`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || "No se pudieron obtener las entradas detalladas";
    throw new Error(msg);
  }

  return res.json();
}

export async function createEntrada(idSesion: string, fila: number, asiento: number, token: string) {
  const res = await fetch(`${API_URL}/entrada/${idSesion}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ numFila: fila, numAsiento: asiento }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || `Esta compra sobrepasa el límite de 10 entradas por usuario o la sesión ya ha empezado`;
    throw new Error(msg);
  }

  return res.json();
}

export async function deleteEntrada(id: number, token: string) {
  const res = await fetch(`${API_URL}/entrada/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || "No se pudo eliminar la entrada";
    throw new Error(msg);
  }

  return res;
}

// ==================== SALAS ====================

export async function getSalaById(id: string) {
  const res = await fetch(`${API_URL}/sala/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Error al obtener la sala con ID ${id}`);
  }
  return res.json();
}

export async function getSalaBySesionId(idSesion: string) {
  console.log("Fetch sala para sesión:", idSesion)
  const res = await fetch(`${API_URL}/sala/sesion/${idSesion}`, { cache: "no-store" })
  console.log("Estado respuesta:", res.status)
  const text = await res.text()
  console.log("Cuerpo respuesta:", text)

  if (!res.ok) {
    throw new Error(`Error al obtener la sala para la sesión ${idSesion}`)
  }

  return JSON.parse(text)
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
        throw errorData;
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

export async function updateUsuario(data: any, token: string) {
  const response = await fetch(`${API_URL}/usuario`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMsg = errorData?.message || "Error al actualizar el perfil."
    throw new Error(errorMsg)
  }

  return response.json()
}

export async function updateAdmin(data: any, token: string) {
  const response = await fetch(`${API_URL}/admin`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const errorMsg = errorData?.message || "Error al actualizar el perfil."
    throw new Error(errorMsg)
  }

  return response.json()
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
