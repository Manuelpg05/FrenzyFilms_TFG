// lib/api.ts

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
