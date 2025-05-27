import { use } from "react"
import SessionsPageClient from "./sessionsPageClient"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <SessionsPageClient peliculaId={id} />
}
