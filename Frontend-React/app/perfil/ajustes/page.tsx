"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SettingsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push("/perfil/entradas")
  }, [router])

  return null
}
