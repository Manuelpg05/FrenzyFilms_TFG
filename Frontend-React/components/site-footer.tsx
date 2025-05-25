import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <img src="/images/frenzy-films-logo.png" alt="FrenzyFilms Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold text-white">FrenzyFilms</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Tu destino cinematográfico preferido, con las mejores películas, la mejor experiencia y el mejor servicio.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">
                  Cartelera
                </Link>
              </li>
              <li>
                <Link href="/promociones" className="text-gray-400 hover:text-white">
                  Promociones
                </Link>
              </li>
              <li>
                <Link href="/cines" className="text-gray-400 hover:text-white">
                  Nuestros Cines
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Información Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-gray-400 hover:text-white">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-gray-400 hover:text-white">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-600" />
                <span>Av. del Cine 123, Ciudad</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-red-600" />
                <span>+34 912 345 678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-red-600" />
                <span>info@cinemax.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} FrenzyFilms. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
