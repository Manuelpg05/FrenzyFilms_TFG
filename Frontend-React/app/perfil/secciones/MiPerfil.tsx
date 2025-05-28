"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getUserProfile, updateUsuario, updateAdmin, deleteUsuario, deleteAdmin } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Flame } from "lucide-react"

export default function PerfilUsuario() {
    const { toast } = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<any>(null)
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        telefono: "",
        passwordActual: "",
        passwordNueva: "",
        confirmarPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [hasChanges, setHasChanges] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) throw new Error("No estás autenticado")
                const data = await getUserProfile(token)
                setProfile(data)
                setFormData({
                    nombre: data.nombre || "",
                    email: data.email || "",
                    telefono: data.telefono || "",
                    passwordActual: "",
                    passwordNueva: "",
                    confirmarPassword: "",
                })
            } catch (error: any) {
                toast({ title: "Error", description: error.message })
                router.push("/login")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    useEffect(() => {
        if (!profile) return
        const { nombre, email, telefono } = formData
        const isDifferent = (
            nombre !== profile.nombre ||
            email !== profile.email ||
            telefono !== profile.telefono ||
            formData.passwordActual !== "" ||
            formData.passwordNueva !== "" ||
            formData.confirmarPassword !== ""
        )
        setHasChanges(isDifferent)
    }, [formData, profile])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: Record<string, string> = {}

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
        if (!formData.email.trim()) newErrors.email = "El email es obligatorio"
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio"
        if (!formData.passwordActual.trim()) {
            newErrors.passwordActual = "Debes introducir tu contraseña actual"
        } else if (formData.passwordActual.length < 6) {
            newErrors.passwordActual = "La contraseña actual debe tener al menos 6 caracteres"
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "El correo electrónico no es válido"
        }

        if (formData.passwordNueva || formData.confirmarPassword) {
            if (!formData.passwordNueva) newErrors.passwordNueva = "Debes escribir la nueva contraseña"
            else if (formData.passwordNueva.length < 6) newErrors.passwordNueva = "La nueva contraseña debe tener al menos 6 caracteres"

            if (!formData.confirmarPassword) newErrors.confirmarPassword = "Debes confirmar la nueva contraseña"

            if (
                formData.passwordNueva &&
                formData.confirmarPassword &&
                formData.passwordNueva !== formData.confirmarPassword
            ) {
                newErrors.passwordNueva = "Las contraseñas no coinciden"
                newErrors.confirmarPassword = "Las contraseñas no coinciden"
            }
        }

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return

        const { passwordActual, passwordNueva, confirmarPassword, ...dataToSend } = formData
        const passwordToSend = passwordNueva || passwordActual
        ; (dataToSend as any).password = passwordToSend

        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No estás autenticado")

            if (profile.rol === "ADMIN") {
                await updateAdmin(dataToSend, token)
            } else {
                await updateUsuario(dataToSend, token)
            }

            toast({ title: "Datos actualizados correctamente" })

            localStorage.removeItem("token")
            router.push("/login")
        } catch (error: any) {
            console.error("Error:", error)
            if (error && typeof error === "object" && !Array.isArray(error) && Object.keys(error).length > 0) {
                setErrors(error as Record<string, string>)
            } else if (error instanceof Error) {
                toast({ title: "Error", description: error.message })
            }
        }
    }

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) throw new Error("No estás autenticado")

            if (profile.rol === "ADMIN") {
                await deleteAdmin(token)
            } else {
                await deleteUsuario(token)
            }

            toast({ title: "Cuenta eliminada correctamente" })
            localStorage.removeItem("token")
            router.push("/login")
        } catch (error: any) {
            toast({ title: "Error al eliminar la cuenta", description: error.message })
        } finally {
            setIsDeleteDialogOpen(false)
        }
    }

    const formatTelefono = (telefono: string) => {
        return telefono?.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") || "-"
    }

    if (loading) {
        return <p className="text-white">Cargando perfil...</p>
    }

    return (
        <div className="bg-gray-900 p-6 rounded-md w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Mi Perfil</h2>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-sm"
                >
                    Eliminar Cuenta
                </Button>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                    <img
                        src={profile.foto}
                        alt="Foto de perfil"
                        className="w-16 h-16 object-cover rounded-full border border-gray-700"
                    />
                    <div>
                        <p className="text-red-600 font-semibold text-xl">@{profile.username}</p>
                        <p className="text-white font-semibold">{profile.nombre}</p>
                        <p className="text-gray-400 text-sm">{profile.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 text-sm">
                    <div>
                        <span className="font-semibold text-white">Teléfono:</span> {formatTelefono(profile.telefono)}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Rol:</span>
                        <span className="text-red-600 font-semibold">{profile.rol === "ADMIN" ? "Frenzy Admin" : "Frenzy User"}</span>
                        <Flame className="h-4 w-4 text-red-600" />
                    </div>
                </div>
            </div>

            <hr className="border-gray-700 my-6" />

            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white">Editar información</h3>

                {["nombre", "email", "telefono"].map((field) => (
                    <div key={field}>
                        <label className="text-gray-400 text-sm capitalize">{field}</label>
                        <Input
                            name={field}
                            value={(formData as any)[field]}
                            onChange={handleChange}
                            type={field === "email" ? "email" : "text"}
                            className={errors[field] ? "border-red-500" : ""}
                        />
                        {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                    </div>
                ))}

                <div>
                    <label className="text-gray-400 text-sm">Contraseña actual</label>
                    <Input
                        name="passwordActual"
                        value={formData.passwordActual}
                        onChange={handleChange}
                        type="password"
                        className={errors.passwordActual ? "border-red-500" : ""}
                    />
                    {errors.passwordActual && <p className="text-red-500 text-xs mt-1">{errors.passwordActual}</p>}
                </div>

                <div>
                    <label className="text-gray-400 text-sm">Nueva Contraseña</label>
                    <Input
                        name="passwordNueva"
                        value={formData.passwordNueva}
                        onChange={handleChange}
                        type="password"
                        className={errors.passwordNueva ? "border-red-500" : ""}
                    />
                    {errors.passwordNueva && <p className="text-red-500 text-xs mt-1">{errors.passwordNueva}</p>}
                </div>

                <div>
                    <label className="text-gray-400 text-sm">Confirmar Contraseña</label>
                    <Input
                        name="confirmarPassword"
                        value={formData.confirmarPassword}
                        onChange={handleChange}
                        type="password"
                        className={errors.confirmarPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmarPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmarPassword}</p>}
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={!hasChanges}
                    >
                        Guardar Cambios
                    </Button>
                </div>
            </form>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-gray-900 text-white border-gray-700">
                    <DialogHeader>
                        <DialogTitle>¿Estás seguro de eliminar tu cuenta?</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Esta acción es irreversible. Si tienes entradas activas, no podrás eliminar tu cuenta.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Eliminar cuenta
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
