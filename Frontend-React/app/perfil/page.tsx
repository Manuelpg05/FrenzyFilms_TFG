'use client';
export const dynamic = 'force-dynamic';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Entradas from "./secciones/MisEntradas"
import PerfilUsuario from "./secciones/MiPerfil"
import { getUserProfile } from "@/lib/api"
import { Roles } from "@/lib/enums"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PerfilPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState("perfil")
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
        setIsAdmin(profile.rol === Roles.ADMIN)
      } catch (error) {
        console.error("Error al cargar el perfil", error)
      }
    }

    fetchProfile()
  }, [])

  useEffect(() => {
    const section = searchParams.get("seccion")
    if (section === "entradas" || section === "historial") {
      setActiveTab(section)
    } else {
      setActiveTab("perfil")
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue={activeTab} value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-900 rounded-md flex w-full max-w-md">
              <TabsTrigger
                value="perfil"
                className="flex-1 text-center data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-500 px-4 py-2 rounded"
              >
                Mi Perfil
              </TabsTrigger>

              {!isAdmin && (
                <>
                  <TabsTrigger
                    value="entradas"
                    className="flex-1 text-center data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-500 px-4 py-2 rounded"
                  >
                    Mis Entradas
                  </TabsTrigger>

                  <TabsTrigger
                    value="historial"
                    className="flex-1 text-center data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-500 px-4 py-2 rounded"
                  >
                    Historial
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          <TabsContent value="perfil">
            <PerfilUsuario />
          </TabsContent>

          {!isAdmin && (
            <>
              <TabsContent value="entradas">
                <Entradas modo="futuras" />
              </TabsContent>

              <TabsContent value="historial">
                <Entradas modo="historial" />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  )
}
