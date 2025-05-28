"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MisEntradas from "./secciones/MisEntradas"
import { getUserProfile } from "@/lib/api"
import { Roles } from "@/lib/enums"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PerfilPage() {
  const [isAdmin, setIsAdmin] = useState(false)
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

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto py-8 px-4">
        <Tabs defaultValue="preferencias" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-900 rounded-md">
              <TabsTrigger
                value="preferencias"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-500 px-4 py-2 rounded"
              >
                Preferencias
              </TabsTrigger>

              {!isAdmin && (
                <TabsTrigger
                  value="entradas"
                  className="data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-500 px-4 py-2 rounded"
                >
                  Mis Entradas
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="preferencias">
            <h1 className="text-3xl font-bold text-white">Preferencias (aquí lo que desees)</h1>
          </TabsContent>

          {!isAdmin && (
            <TabsContent value="entradas">
              <MisEntradas />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  )
}
