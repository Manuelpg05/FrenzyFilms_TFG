"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getUserProfile } from "@/lib/api"
import { Roles } from "@/lib/enums"
import SalasAdmin from "./secciones/SalasAdmin"
import PeliculasAdmin from "./secciones/PeliculasAdmin"
import SesionesAdmin from "./secciones/SesionesAdmin"

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState("salas")
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const profile = await getUserProfile(token)
        if (profile.rol !== Roles.ADMIN) {
          router.push("/perfil")
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error("Error al cargar el perfil", error)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const section = searchParams.get("seccion")
    if (section === "salas" || section === "peliculas" || section === "sesiones") {
      setActiveTab(section)
    } else {
      setActiveTab("peliculas")
    }
  }, [searchParams])

  if (!isAdmin) {
    return <p className="text-white text-center py-12">Verificando permisos...</p>
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-900 rounded-md flex w-full max-w-md">
              <TabsTrigger
                value="salas"
                className="flex-1 text-center data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-500 px-4 py-2 rounded"
              >
                Salas
              </TabsTrigger>
              <TabsTrigger
                value="peliculas"
                className="flex-1 text-center data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-500 px-4 py-2 rounded"
              >
                Películas
              </TabsTrigger>
              <TabsTrigger
                value="sesiones"
                className="flex-1 text-center data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-500 px-4 py-2 rounded"
              >
                Sesiones
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="salas">
            <SalasAdmin />
          </TabsContent>
          <TabsContent value="peliculas">
            <PeliculasAdmin />
          </TabsContent>
          <TabsContent value="sesiones">
            <SesionesAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
