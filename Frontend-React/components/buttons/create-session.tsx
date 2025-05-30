"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Plus } from "lucide-react";
import { Formato } from "@/lib/enums";
import { format } from "date-fns";
import { getSalaBySesionId, createSesion } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function CreateSessionButton({
  selectedPelicula,
  salas,
  onSesionCreada
}: {
  selectedPelicula: any;
  salas: any[];
  onSesionCreada: (sesion: any) => void;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [fecha, setFecha] = useState<Date | undefined>();
  const [hora, setHora] = useState<string>("");
  const [minuto, setMinuto] = useState<string>("");
  const [formato, setFormato] = useState<string>("DIGITAL");
  const [precio, setPrecio] = useState<string>("");
  const [selectedSala, setSelectedSala] = useState<string>("");

  const { toast } = useToast();

  const handleCrearSesion = async () => {
    if (!fecha || !hora || !minuto || !formato || !precio || !selectedSala) {
      toast({ title: "Completa todos los campos" });
      return;
    }

    try {
      const idPelicula = selectedPelicula.id.toString();
      const idSala = selectedSala;

      const formatoFinal = formato === "3D" ? "TRES_D" : formato;

      const nuevaSesion = {
        fecha: format(fecha, "dd-MM-yyyy"),
        horaInicio: `${hora.padStart(2, "0")}:${minuto.padStart(2, "0")}:00`,
        precioEntrada: parseFloat(precio),
        formato: formatoFinal,
      };

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado");

      const creada = await createSesion(nuevaSesion, idPelicula, idSala, token);
      const sala = await getSalaBySesionId(creada.id.toString());

      onSesionCreada({ ...creada, sala, entradas: [] });

      setOpenModal(false);
      setFecha(undefined);
      setHora("");
      setMinuto("");
      setFormato("DIGITAL");
      setPrecio("");
      setSelectedSala("");

      toast({ title: "Sesión creada exitosamente" });
    } catch (error: any) {
      toast({ title: "Error al crear sesión", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white mb-4 mt-4 w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" /> Crear sesión
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Crear sesión</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Label>Selecciona fecha</Label>
          <Calendar mode="single" selected={fecha} onSelect={setFecha} className="self-center rounded-md border border-gray-700" />

          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Hora</Label>
              <Select onValueChange={setHora} value={hora}>
                <SelectTrigger className="bg-gray-800">
                  <SelectValue placeholder="Hora" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>{i.toString().padStart(2, "0")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Minuto</Label>
              <Select onValueChange={setMinuto} value={minuto}>
                <SelectTrigger className="bg-gray-800">
                  <SelectValue placeholder="Minuto" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>{i.toString().padStart(2, "0")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Label>Formato</Label>
          <Select onValueChange={setFormato} value={formato}>
            <SelectTrigger className="bg-gray-800">
              <SelectValue placeholder="Selecciona formato" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Formato).map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Sala</Label>
          <Select onValueChange={setSelectedSala} value={selectedSala}>
            <SelectTrigger className="bg-gray-800">
              <SelectValue placeholder="Selecciona sala" />
            </SelectTrigger>
            <SelectContent>
              {salas.slice().sort((a, b) => a.numSala - b.numSala).map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>Sala {s.numSala}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Precio (€)</Label>
          <Input type="number" min="0" step="0.5" value={precio} onChange={(e) => setPrecio(e.target.value)} className="bg-gray-800" />
        </div>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleCrearSesion} className="bg-green-600 hover:bg-green-700 text-white">Crear sesión</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
