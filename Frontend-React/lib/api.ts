import { Estado } from "./enums"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ==================== TMDB ====================

export async function searchPeliculasTmdb(titulo: string, pagina: number = 1) {
  const response = await fetch(`${API_URL}/tmdb/buscar?titulo=${titulo}&pagina=${pagina}`)

  if (!response.ok) {
    throw new Error("Error al buscar películas en TMDb")
  }

  return await response.json()
}

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

// ==================== PELICULAS ====================
export async function importarPeliculaDesdeTmdb(idTmdb: number, token: string) {
  const response = await fetch(`${API_URL}/pelicula/importar/${idTmdb}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    let errorMessage = "Error al importar la película."

    try {
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json()
        if (typeof errorData === "object" && errorData !== null) {
          const firstKey = Object.keys(errorData)[0]
          if (firstKey) {
            errorMessage = errorData[firstKey]
          }
        }
      } else {
        const fallbackText = await response.text()
        if (fallbackText) errorMessage = fallbackText
      }
    } catch (err) {
      errorMessage = "Error inesperado al procesar la respuesta del servidor."
    }

    throw new Error(errorMessage)
  }

  return await response.json()
}

export async function eliminarPelicula(id: number, token: string) {
  const response = await fetch(`${API_URL}/pelicula/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "Error al eliminar la película")
  }

  return await response.text()
}

export async function actualizarEstadoPelicula(id: number, nuevoEstado: string, token: string) {
  const response = await fetch(`${API_URL}/pelicula/${id}/estado/${nuevoEstado}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error al actualizar el estado de la película");
  }

  return await response.text();
}


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

export async function getPeliculas(token: string) {
  const response = await fetch(`${API_URL}/pelicula`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("No se pudo obtener el listado de películas")
  }

  return await response.json()
}


// ==================== SESIONES ====================

export async function createSesion(nuevaSesion: any, idPelicula: string, idSala: string, token: string) {
  const res = await fetch(`${API_URL}/sesion/P${idPelicula}/S${idSala}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nuevaSesion),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const msg = errorData?.message || `Conflicto de horario detectado`;
    throw new Error(msg);
  }

  return res.json();
}

export async function updateSesion(id: number, sesionU: any, token: string) {
  const response = await fetch(`${API_URL}/sesion/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sesionU),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    const errorMessage = text || `No se pudo actualizar la sesión ${id}`;
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function deleteSesion(id: number, token: string) {
  const response = await fetch(`${API_URL}/sesion/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const text = await response.text().catch(() => null)
    const errorMessage = text || `No se pudo eliminar la sesión ${id}`
    throw new Error(errorMessage)
  }

  return true
}

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

export async function createSala(nuevaSala: { numSala: number; numFilas: number; numColumnas: number }, token: string) {
  const response = await fetch(`${API_URL}/sala`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nuevaSala),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "Error al crear la sala")
  }

  return await response.json()
}

export async function updateSala(id: number, datosSala: { numSala: number; numFilas: number; numColumnas: number }, token: string) {
  const response = await fetch(`${API_URL}/sala/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(datosSala),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error al actualizar la sala");
  }

  return await response.json();
}


export async function getSalas(token: string) {
  const response = await fetch(`${API_URL}/sala`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "Error al obtener las salas")
  }

  return await response.json()
}

export async function eliminarSala(id: number, token: string) {
  const response = await fetch(`${API_URL}/sala/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "Error al eliminar la sala")
  }

  return await response.text()
}

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


export async function deleteUsuario(token: string) {
  const response = await fetch(`${API_URL}/usuario`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMsg = "Error al eliminar la cuenta.";

    if (response.status === 409) {
      errorMsg = "No puedes eliminar tu cuenta si tienes entradas en sesiones futuras.";
    } else {
      try {
        const errorData = await response.json();
        if (errorData && typeof errorData === "object") {
          errorMsg = errorData.message || errorMsg;
        }
      } catch (e) {
        // Si no hay JSON válido, mantengo el mensaje por defecto
      }
    }

    throw new Error(errorMsg);
  }

  return true;
}



export async function deleteAdmin(token: string) {
  const response = await fetch(`${API_URL}/admin`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMsg = errorData?.message || "Error al eliminar la cuenta.";
    throw new Error(errorMsg);
  }

  return true;
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
