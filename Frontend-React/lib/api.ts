// lib/api.ts

import { Estado } from "./estados";

export async function getPeliculasCartelera() {
  try {
    const res = await fetch("http://localhost:8080/pelicula/cartelera", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error al obtener las películas en cartelera");
    }

    return res.json();
  } catch (error) {
    console.error("Error en getPeliculasCartelera:", error);
    throw error;
  }
}

export async function getPeliculasDestacadas() {
  try {
    const res = await fetch("http://localhost:8080/pelicula/cartelera", { cache: "no-store" });
    if (!res.ok) throw new Error("Error al obtener películas destacadas");
    const data = await res.json();

    const estrenos = data.filter((p: any) => p.estado === Estado.ESTRENO);

    if (estrenos.length > 0) {
      return estrenos;
    } else {
      // Si no hay estrenos, obtener las 3 DISPONIBLES más recientes (por fechaEstreno)
      const disponibles = data
        .filter((p: any) => p.estado === Estado.DISPONIBLE)
        .sort((a: any, b: any) => {
          const fechaA = new Date(a.fechaEstreno);
          const fechaB = new Date(b.fechaEstreno);
          return fechaB.getTime() - fechaA.getTime();
        })
        .slice(0, 3);
      return disponibles;
    }
  } catch (error) {
    console.error("Error en getPeliculasDestacadas:", error);
    throw error;
  }
}


