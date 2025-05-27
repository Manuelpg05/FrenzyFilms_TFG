// app/pelicula/[id]/page.tsx
import { use } from "react"
import MovieDetailClient from "./MovieDetailClient"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return <MovieDetailClient peliculaId={id} />
}
