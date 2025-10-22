import { FaBars, FaBell, FaSearch } from "react-icons/fa";

// 1. ¡IMPORTANTE! Tu Header necesita recibir esta prop para funcionar
interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-[#E0F2F7] shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 fixed top-0 right-0 left-0 md:left-64 z-30">
      
      {/* --- LADO IZQUIERDO --- */}
      <div className="flex items-center gap-4">
        
        <button
          onClick={toggleSidebar} // <-- ¡Prop restaurada!
          className="text-gray-500 hover:text-gray-700 md:hidden"
          aria-label="Abrir menú"
        >
          <FaBars className="text-2xl" />
        </button>

        {/* 3. TU LOGO (Oculto en móvil, visible en desktop) */}
        <div className="hidden md:block">
          
        </div>
      </div>

      {/* --- LADO DERECHO --- */}
      <div className="flex items-center gap-4">
        
        {/* 4. Barra de búsqueda (restaurada y mejorada) */}
        <div className="relative hidden sm:block"> {/* Opcional: ocultar en móviles pequeños */}
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 w-full max-w-xs rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
          <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* 5. Iconos y Avatar */}
        <div className="flex items-center gap-3">
          <button
            className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100"
            aria-label="Notificaciones"
          >
            <FaBell className="text-xl" />
          </button>

          {/* Avatar (mejorado) */}
          <img
            className="w-9 h-9 rounded-full object-cover ring-2 ring-offset-2 ring-gray-200"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Kr3r-ePiqzglp9jjnNOCD7rvStHNqk0WrA&s" 
            alt="Avatar de usuario"
          />
        </div>
      </div>
    </header>
  );
}