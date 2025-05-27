"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Film, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { loginUser } from "@/lib/api"
import '@/styles/globals.css';

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/")
    } else {
      setLoadingAuth(false)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      username: !formData.username ? "El usuario es requerido" : "",
      password: !formData.password
        ? "La contraseña es requerida"
        : formData.password.length < 6
        ? "La contraseña debe tener al menos 6 caracteres"
        : "",
    }

    setErrors(newErrors)

    if (!newErrors.username && !newErrors.password) {
      setLoading(true)

      loginUser(formData.username, formData.password)
        .then((token) => {
          localStorage.setItem("token", token)
          window.dispatchEvent(new Event("storage"))

          toast({
            title: "¡Inicio de sesión exitoso!",
            description: "Bienvenido a FrenzyFilms.",
          })

          router.push("/")
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          })
        })
        .finally(() => setLoading(false))
    }
  }

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader className="h-10 w-10 text-red-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden flex min-h-screen w-full flex-col items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-xl animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-xl animate-pulse" />

        <div className="relative z-10 bg-gray-900 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center space-y-2 mb-8">
            <div className="bg-gray-800 p-3 rounded-full">
              <img src="/images/frenzy-films-logo.png" alt="FrenzyFilms Logo" className="h-16 w-16 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">FrenzyFilms</h1>
            <p className="text-gray-400 text-sm">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-200">
                Usuario
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Introduce tu usuario"
                value={formData.username}
                onChange={handleChange}
                className={`bg-gray-800 border-gray-700 text-white ${errors.username ? "border-red-500" : ""}`}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-gray-800 border-gray-700 text-white pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-red-400 hover:text-red-300">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white">
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </Button>

            <div className="flex items-center justify-center space-x-2 pt-4">
              <span className="text-sm text-gray-400">
                ¿No tienes cuenta?{" "}
                <a href="/registro/usuario" className="text-red-400 hover:text-red-300 font-medium">
                  Regístrate
                </a>
              </span>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FrenzyFilms. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
