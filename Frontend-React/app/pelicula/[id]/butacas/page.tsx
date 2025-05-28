"use client"

import { use } from "react"
import SeatsPage from "./seatsPage"

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <SeatsPage id={id} />
}
