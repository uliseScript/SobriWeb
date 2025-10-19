import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex flex-wrap items-center justify-between px-6 py-3 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/src/assets/Sobriw.png" alt="SobriWeb" className="h-14 md:h-20" />
      </div>

      {/* Botón hamburguesa */}
      <div className="flex md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
          aria-label="Toggle menu"
        >
          <img
            src={
              open
                ? "https://img.icons8.com/ios-filled/50/000000/delete-sign.png"
                : "https://img.icons8.com/ios-filled/50/000000/menu--v1.png"
            }
            width="30"
            height="30"
            alt="menu icon"
          />
        </button>
      </div>

      {/* Menú de navegación */}
      <div
        className={`${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0 md:opacity-100 md:max-h-full"
        } overflow-hidden transition-all duration-500 ease-in-out w-full md:w-auto md:flex md:items-center md:space-x-6 text-right font-medium mt-4 md:mt-0`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
          <a
            href="#comunidad"
            className="block md:inline-block text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            Comunidad
          </a>
          <a
            href="#mapa"
            className="block md:inline-block text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            Mapa de Centros
          </a>
          <a
            href="#nosotros"
            className="block md:inline-block text-gray-700 hover:text-blue-600 px-3 py-2 transition-colors duration-200"
            onClick={() => setOpen(false)}
          >
            Sobre Nosotros
          </a>

          {/* Botones visibles en móvil dentro del menú */}
          <div className="flex flex-col md:hidden mt-4 space-y-3">
            <a
              href="login /"
              
              className="flex justify-center items-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              Iniciar sesión
            </a>
            <a
              href="signup /"
              
              className="flex justify-center items-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              Registrarse
            </a>
            
              
          </div>
        </div>
      </div>

      {/* Botones visibles solo en escritorio */}
      <div className="hidden md:flex items-center space-x-3">
        <a
          href="/login"
          className="flex items-center bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h9a2.25 2.25 0 002.25-2.25V15m3-3h-8.25m0 0l3-3m-3 3l3 3"
            />
          </svg>
          Iniciar sesión
        </a>

        <a
          href="/signup"
          className="flex items-center bg-gray-900 text-white font-medium px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Regístrate gratis
        </a>
      </div>
    </nav>
  );
}
