"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Search, Loader } from "lucide-react";
import Link from "next/link";
import { getPeliculasDestacadas, getUserProfile } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Roles } from "@/lib/enums";

export default function HeroSection() {
  const [destacadas, setDestacadas] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrollEnd, setIsScrollEnd] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPeliculasDestacadas()
      .then((data) => {
        const ordenadas = data.sort((a: any, b: any) => new Date(b.fechaEstreno).getTime() - new Date(a.fechaEstreno).getTime());
        setDestacadas(ordenadas);
      })
      .catch((err) => console.error(err));

    const token = localStorage.getItem("token");
    if (token) {
      getUserProfile(token)
        .then((profile) => {
          setIsAdmin(profile.rol === Roles.ADMIN);
        })
        .catch((err) => {
          console.error("Error al obtener el perfil del usuario:", err);
          setIsAdmin(false);
        });
    }
  }, []);

  useEffect(() => {
    if (destacadas.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % destacadas.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [destacadas]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setIsScrollEnd(false);
    }
  }, [currentIndex]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
      setIsScrollEnd(atEnd);
    }
  };

  if (destacadas.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-white text-lg">
        <Loader className="h-10 w-10 text-red-600 animate-spin mr-2" />
        Cargando películas destacadas...
      </div>
    );
  }

  const currentMovie = destacadas[currentIndex];

  return (
    <div className="relative h-[70vh] md:h-[80vh] min-h-[400px] overflow-hidden">
      {/* Fondo animado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.6, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentMovie.banner || "/placeholder.svg"})` }}
        ></motion.div>
      </AnimatePresence>

      {/* Gradiente oscuro */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

      {/* Contenido principal animado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id + "-content"}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative z-20 h-full container mx-auto flex flex-col justify-end md:justify-center pb-16 px-4 pt-24 sm:pt-32 md:pt-40"
        >
          <div className="max-w-3xl mb-8 transition-all duration-500 transform translate-y-0">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
              {currentMovie.titulo}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <div className="relative flex items-center justify-center">
                  <Star className="h-12 sm:h-14 w-12 sm:w-14 fill-yellow-500 text-yellow-500 drop-shadow-md" />
                  <span className="absolute text-black font-bold text-xs sm:text-sm">
                    {currentMovie.calificacionTmdb ? currentMovie.calificacionTmdb.toFixed(1) : "N/A"}
                  </span>
                </div>
                <span className="text-gray-300 ml-2 text-sm sm:text-base">Estreno destacado</span>
              </div>
            </div>

            {/* Sinopsis con scroll y fade */}
            <div className="relative">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="max-h-32 overflow-y-auto pr-2 scrollbar-hide"
              >
                <p className="text-gray-300 text-sm sm:text-base md:text-lg">
                  {currentMovie.sinopsis}
                </p>
              </div>

              {scrollRef.current && scrollRef.current.scrollHeight > scrollRef.current.clientHeight && (
                <div
                  className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none transition-opacity duration-300 ${isScrollEnd ? "opacity-0" : "opacity-100"
                    }`}
                ></div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              {isAdmin ? (
                <Button asChild size="lg" className="text-white bg-blue-600 hover:bg-blue-700">
                  <Link href={`/pelicula/${currentMovie.id}`}>
                    Ver más
                    <Search className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="text-white bg-red-600 hover:bg-red-700">
                  <Link href={`/pelicula/${currentMovie.id}`}>
                    Comprar Entradas
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 flex items-center justify-between">
                <Link
                  href={`https://www.youtube.com/results?search_query=trailer+oficial+en+español+${currentMovie.titulo.replace(/\s+/g, "+")}`}
                  target="_blank"
                  className="flex items-center"
                >
                  <span>Ver Trailer en YouTube</span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicadores fijos */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-30">
        {destacadas.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all ${index === currentIndex ? "w-8 bg-red-600" : "w-4 bg-gray-500"
              }`}
            aria-label={`Ver película ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
