"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getPeliculaById, getSesionById, createEntrada, getSalaBySesionId, getUserProfile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Calendar, Clock, MapPin, Euro, ChevronLeft, Loader2 } from "lucide-react";
import ProgressBar from "@/components/progress-bar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/es";
import Link from "next/link";

dayjs.extend(customParseFormat);
dayjs.locale("es");

export default function SeatsPage({ id }: { id: string }) {
    const [pelicula, setPelicula] = useState<any>(null);
    const [sesion, setSesion] = useState<any>(null);
    const [sala, setSala] = useState<any>(null);
    const [seats, setSeats] = useState<any[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const user = await getUserProfile(token);
                    if (user.rol === "ADMIN") {
                        router.push(`/pelicula/${id}`);
                        return;
                    }
                }

                const sesionIdStr = searchParams.get("sesion");
                const sesionIdInt = sesionIdStr ? parseInt(sesionIdStr) : NaN;

                if (!sesionIdInt || isNaN(sesionIdInt)) {
                    throw new Error("ID de sesión inválido.");
                }

                const peli = await getPeliculaById(id);
                setPelicula(peli);

                const ses = await getSesionById(sesionIdInt.toString());
                const formattedDate = dayjs(ses.fecha, "DD-MM-YYYY").format("dddd, D [de] MMMM [de] YYYY");
                const formattedTime = dayjs(ses.horaInicio, "HH:mm:ss").format("HH:mm");
                setSesion({ ...ses, formattedDate, formattedTime });

                const salaData = await getSalaBySesionId(sesionIdInt.toString());
                setSala(salaData);

                const filas = salaData.numFilas;
                const columnas = salaData.numColumnas;
                const ocupadas = ses.entradas || [];

                const generatedSeats = [];
                for (let row = 1; row <= filas; row++) {
                    for (let col = 1; col <= columnas; col++) {
                        const ocupado = ocupadas.some((e: any) => e.numFila === row && e.numAsiento === col);
                        generatedSeats.push({
                            id: `${row}-${col}`,
                            row,
                            number: col,
                            status: ocupado ? "ocupado" : "disponible",
                        });
                    }
                }

                setSeats(generatedSeats);
            } catch (err: any) {
                console.error("Error en fetchData:", err);
                toast({ title: "Error", description: err.message, variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router, searchParams, toast]);

    const handleSeatClick = (seatId: string) => {
        const seat = seats.find((s) => s.id === seatId);
        if (!seat) return;

        if (seat.status === "disponible" && selectedSeats.length >= 10) {
            toast({
                title: "Límite alcanzado",
                description: "No puedes seleccionar más de 10 butacas por compra.",
                variant: "destructive",
            });
            return;
        }

        setSeats((prev) =>
            prev.map((s) =>
                s.id === seatId
                    ? {
                        ...s,
                        status: s.status === "disponible" ? "selected" : s.status === "selected" ? "disponible" : s.status,
                    }
                    : s
            )
        );

        setSelectedSeats((prev) =>
            seat.status === "disponible"
                ? [...prev, seat]
                : prev.filter((s) => s.id !== seatId)
        );
    };


    const handlePurchase = () => {
        if (selectedSeats.length === 0) {
            toast({ title: "Error", description: "Selecciona al menos una butaca.", variant: "destructive" });
            return;
        }
        if (selectedSeats.length > 10) {
            toast({ title: "Máximo 10 butacas por compra.", variant: "destructive" });
            return;
        }
        setIsConfirmDialogOpen(true);
    };

    const confirmPurchase = async () => {
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Debes iniciar sesión para comprar.");

            for (const seat of selectedSeats) {
                await createEntrada(sesion?.id, seat.row, seat.number, token);
            }

            toast({ title: "Compra realizada", description: "Tus entradas han sido reservadas." });
            router.push("/perfil/entradas");
        } catch (err: any) {
            toast({ title: "Error", description: err.message, variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;
    }

    return (
        <main className="min-h-screen bg-black">
            <div className="container mx-auto py-8 px-4">
                <ProgressBar currentStep={2} />

                <h1 className="text-3xl font-bold text-white mb-8 mt-8 text-center">Selecciona tus butacas</h1>

                <div
                    className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8 relative overflow-hidden"
                    style={{
                        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.95)), url(${pelicula?.banner})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minHeight: "180px",
                    }}
                >
                    <div className="flex flex-wrap items-center gap-6">
                        <img src={pelicula?.cartel} alt={pelicula?.titulo} className="w-32 h-48 object-cover rounded-md shadow-lg" />
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-4">{pelicula?.titulo}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-gray-300">
                                <div className="bg-gray-800/50 p-3 rounded-md flex items-center gap-2">
                                    <Calendar className="h-5 w-5 shrink-0 text-red-600" />
                                    {sesion?.formattedDate}
                                </div>
                                <div className="bg-gray-800/50 p-3 rounded-md flex items-center gap-2">
                                    <Clock className="h-5 w-5 shrink-0 text-red-600" />
                                    {sesion?.formattedTime}
                                </div>
                                <div className="bg-gray-800/50 p-3 rounded-md flex items-center gap-2">
                                    <MapPin className="h-5 w-5 shrink-0 text-red-600" />
                                    Sala {sala?.numSala || "-"}
                                </div>
                                <div className="bg-gray-800/50 p-3 rounded-md flex items-center gap-2">
                                    <Euro className="h-5 w-5 shrink-0 text-red-600" />
                                    {sesion?.precioEntrada.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
                    <h3 className="text-xl text-center font-bold mb-6">Elige tu asiento</h3>

                    <div className="flex flex-wrap gap-6 mb-6 justify-center">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-400 rounded-sm"></div>
                            <span>Disponible</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
                            <span>Ocupada</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 rounded-sm"></div>
                            <span>Seleccionada</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <div className="w-full max-w-[900px]">
                            {Array.from(new Set(seats.map((s) => s.row)))
                                .sort((a, b) => b - a)
                                .map((row) => {
                                    const rowSeats = seats.filter((s) => s.row === row);
                                    const totalSeats = rowSeats.length;
                                    const firstGapIndex = Math.floor(totalSeats * 0.2);
                                    const secondGapIndex = Math.floor(totalSeats * 0.8);

                                    return (
                                        <div key={row} className="flex justify-center items-center mb-1 gap-[clamp(2px,0.5vw,4px)]">
                                            <div className="w-6 text-center text-gray-400 text-xs sm:text-sm">{row}</div>
                                            <div className="flex overflow-hidden">
                                                {rowSeats.map((seat, index) => {
                                                    const color =
                                                        seat.status === "disponible"
                                                            ? "text-gray-400 hover:text-gray-300"
                                                            : seat.status === "selected"
                                                                ? "text-green-500"
                                                                : "text-red-600 cursor-not-allowed opacity-70";

                                                    let marginRight = "clamp(2px,0.5vw,4px)";
                                                    if (index === firstGapIndex || index === secondGapIndex) {
                                                        marginRight = "clamp(16px,2vw,24px)"; // Espacio del pasillo
                                                    }

                                                    return (
                                                        <button
                                                            key={seat.id}
                                                            onClick={() => handleSeatClick(seat.id)}
                                                            disabled={seat.status === "ocupado"}
                                                            className={`flex items-center justify-center ${color} transition-all`}
                                                            style={{
                                                                width: "clamp(16px, 4vw, 32px)",
                                                                height: "clamp(16px, 4vw, 32px)",
                                                                marginRight: index === rowSeats.length - 1 ? 0 : marginRight,
                                                            }}
                                                            aria-label={`Fila ${seat.row}, Asiento ${seat.number}`}
                                                        >
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="w-full h-full"
                                                            >
                                                                <path d="M19 9V7C19 5.13 17.87 4 16 4H8C6.13 4 5 5.13 5 7V9" stroke="currentColor" strokeWidth="2" />
                                                                <path
                                                                    d="M3 9H21V15C21 16.1 20.1 17 19 17H5C3.9 17 3 16.1 3 15V9Z"
                                                                    fill={seat.status === "selected" ? "currentColor" : "none"}
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                />
                                                                <path d="M5 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                                <path d="M19 17V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                            </svg>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="w-6 text-center text-gray-400 text-xs sm:text-sm">{row}</div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>


                    <div className="bg-gray-800 rounded-lg p-4 mt-6">
                        <h4 className="font-medium mb-2">Butacas seleccionadas:</h4>

                        {selectedSeats.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-300">
                                {selectedSeats.map((s) => (
                                    <li key={`${s.row}-${s.number}`}>
                                        Fila {s.row}, Asiento {s.number}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">Ninguna butaca seleccionada</p>
                        )}

                        <p className="text-xl font-bold text-white mt-4">
                            Total: {(selectedSeats.length * sesion?.precioEntrada).toFixed(2)}€
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 gap-4">
                        <Button asChild size="lg" className="bg-gray-700 hover:bg-gray-600 text-white">
                            <Link href={`/pelicula/${id}/sesiones`}>
                                <ChevronLeft className="mr-2 h-5 w-5" />
                                Volver
                            </Link>
                        </Button>

                        <Button
                            onClick={handlePurchase}
                            disabled={selectedSeats.length === 0}
                            className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 text-lg"
                        >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Comprar entradas ({selectedSeats.length})
                        </Button>
                    </div>

                </div>
            </div>

            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent className="bg-gray-900 text-white border-gray-800">
                    <DialogHeader>
                        <DialogTitle>Confirmar compra</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Estás a punto de comprar {selectedSeats.length} entrada(s) para {pelicula?.titulo}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="mb-2"><span className="font-medium">Fecha:</span> {sesion?.fecha || "-"}</p>
                        <p className="mb-2"><span className="font-medium">Hora:</span> {sesion?.horaInicio || "-"}</p>
                        <p className="mb-2"><span className="font-medium">Sala:</span> {sala?.numSala || "-"}</p>
                        <p className="font-bold text-lg mt-4">Total: {(selectedSeats.length * sesion?.precioEntrada).toFixed(2)}€</p>
                    </div>
                    <DialogFooter>
                        {isProcessing && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
                        {isProcessing ? "Procesando..." : ""}

                        <Button className="bg-gray-700 hover:bg-gray-600 text-white" onClick={() => setIsConfirmDialogOpen(false)}>Cancelar</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmPurchase}>Confirmar compra</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
