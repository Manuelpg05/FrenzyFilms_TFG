"use client";

import { useState } from "react";
import { Eye, EyeOff, Film, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { checkUserExists } from "@/lib/api";
import '@/styles/globals.css';

type AuthFormProps = {
  title: string;
  description: string;
  buttonText: string;
  onSubmit: (formData: Record<string, string>) => Promise<void>;
  fields: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
  }[];
};

export default function AuthForm({
  title,
  description,
  buttonText,
  onSubmit,
  fields,
}: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleShowPassword = (name: string) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      const value = formData[f.name]?.trim();
      if (!value) {
        newErrors[f.name] = `El campo ${f.label} es obligatorio`;
      } else {
        if (f.name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[f.name] = "El correo electrónico no es válido";
        }
        if (f.name === "telefono" && !/^[6-9]\d{8}$/.test(value)) {
          newErrors[f.name] = "El teléfono debe comenzar por 6-9 y tener 9 dígitos";
        }
        if (f.name === "password" && value.length < 6) {
          newErrors[f.name] = "La contraseña debe tener al menos 6 caracteres";
        }
      }
    });

    if (!newErrors["username"] && formData["username"]) {
      setCheckingUsername(true);
      try {
        const exists = await checkUserExists(formData["username"].trim());
        if (exists) {
          newErrors["username"] = "Este nombre de usuario ya está en uso";
        }
      } catch (error) {
        newErrors["username"] = "No se pudo verificar el usuario";
      } finally {
        setCheckingUsername(false);
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        await onSubmit(formData);
      } catch (error: any) {
        console.error("Error en onSubmit:", error);

        if (error && typeof error === "object" && !Array.isArray(error) && Object.keys(error).length > 0) {
          // Muestra errores de campos específicos (email, username, etc.)
          setErrors(error as Record<string, string>);
        } else if (error instanceof Error) {
          setErrors({ general: error.message });
        } else if (typeof error === "string") {
          setErrors({ general: error });
        } else {
          setErrors({ general: "Error inesperado. Intenta de nuevo." });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 relative">
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-xl animate-pulse" />
      <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-red-600 rounded-full opacity-20 blur-xl animate-pulse" />

      <div className="relative z-10 bg-gray-900 backdrop-blur-sm border border-gray-800 p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center space-y-2 mb-8">
          <div className="bg-red-600 p-3 rounded-full">
            <Film className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((f) => (
            <div className="space-y-2" key={f.name}>
              <Label htmlFor={f.name} className="text-gray-200">
                {f.label}
              </Label>
              <div className="relative">
                <Input
                  id={f.name}
                  name={f.name}
                  type={f.type === "password" && showPassword[f.name] ? "text" : f.type || "text"}
                  placeholder={f.placeholder}
                  value={formData[f.name] || ""}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className={cn("bg-gray-800 border-gray-700 text-white", errors[f.name] && "border-red-500")}
                />
                {f.type === "password" && (
                  <button
                    type="button"
                    onClick={() => toggleShowPassword(f.name)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword[f.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
              {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
            </div>
          ))}

          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}

          <Button type="submit" disabled={loading || checkingUsername} className="w-full bg-red-600 hover:bg-red-700 text-white">
            {loading || checkingUsername ? (
              <span className="flex items-center justify-center">
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Procesando...
              </span>
            ) : (
              buttonText
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
