import { useState } from "react";
import {
  FaUsers,
  FaChartBar,
  FaSignOutAlt,
  FaTachometerAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  activePage,
  setActivePage,
  isOpen,
  toggleSidebar,
}: SidebarProps) {
  const [openUsers, setOpenUsers] = useState(false);

  // Paleta de colores 
  const bgColor = "bg-[#E0F2F7]"; // Azul muy claro para el fondo
  const hoverColor = "hover:bg-[#B3E5FC]"; // Azul claro para hover
  const activeColor = "bg-[#B3E5FC]"; // Azul claro para activo
  const subMenuBgColor = "bg-[#B3E5FC]"; // Fondo para submenú
  const subMenuHoverColor = "hover:bg-[#81D4FA]"; // Hover más oscuro para submenú
  const subMenuActiveColor = "bg-[#81D4FA]"; // Activo más oscuro para submenú
  const textColor = "text-gray-700"; // Texto oscuro para contraste
  const activeTextColor = "font-semibold"; // Texto en negrita para activo

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 ${bgColor} transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 
        flex flex-col`} // <-- 1. Añadido 'flex flex-col'
    >
      {/* Encabezado con Logo */}
      <div className={`flex items-center justify-center h-16 px-4 ${bgColor} border-b border-gray-200`}>
        <img src="/src/assets/Sobriw.png" alt="SobriWeb" className="h-10" />
        <button
          className={`md:hidden absolute right-4 ${textColor} hover:text-gray-800`}
          onClick={toggleSidebar}
        >
          ✕
        </button>
      </div>

      {/* 2. Sección de navegación principal (con scroll) */}
      <nav className="flex-1 mt-5 overflow-y-auto"> {/* <-- 3. Cambiado 'h-[...]' por 'flex-1' */}
        {/* Panel de control */}
        <button
          onClick={() => setActivePage("dashboard")}
          className={`flex items-center w-full px-4 py-2 ${textColor} ${hoverColor} ${
            activePage === "dashboard" ? `${activeColor} ${activeTextColor}` : ""
          }`}
        >
          <FaTachometerAlt className="mr-3" /> Panel de control
        </button>

        {/* Usuarios (Desplegable) */}
        <div>
          <button
            onClick={() => setOpenUsers(!openUsers)}
            className={`w-full flex items-center justify-between px-4 py-2 ${textColor} ${hoverColor}`}
          >
            <div className="flex items-center">
              <FaUsers className="mr-3" /> Usuarios
            </div>
            {openUsers ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {openUsers && (
            <div className={subMenuBgColor}>
              <button
                onClick={() => setActivePage("all-users")}
                className={`block w-full text-left px-8 py-2 ${textColor} ${subMenuHoverColor} ${
                  activePage === "all-users" ? `${subMenuActiveColor} ${activeTextColor}` : ""
                }`}
              >
                Todos los usuarios
              </button>
              {/* ... otros botones de usuario ... */}
              <button
                onClick={() => setActivePage("user-rehab")}
                className={`block w-full text-left px-8 py-2 ${textColor} ${subMenuHoverColor} ${
                  activePage === "user-rehab" ? `${subMenuActiveColor} ${activeTextColor}` : ""
                }`}
              >
                Personas en rehabilitación
              </button>
              <button
                onClick={() => setActivePage("user-altruista")}
                className={`block w-full text-left px-8 py-2 ${textColor} ${subMenuHoverColor} ${
                  activePage === "user-altruista" ? `${subMenuActiveColor} ${activeTextColor}` : ""
                }`}
              >
                Personas altruistas
              </button>
              <button
                onClick={() => setActivePage("user-partner")}
                className={`block w-full text-left px-8 py-2 ${textColor} ${subMenuHoverColor} ${
                  activePage === "user-partner" ? `${subMenuActiveColor} ${activeTextColor}` : ""
                }`}
              >
                Centros de rehabilitación
              </button>
            </div>
          )}
        </div>

        {/* Analytics */}
        <button
          onClick={() => setActivePage("analytics")}
          className={`flex items-center w-full px-4 py-2 ${textColor} ${hoverColor} ${
            activePage === "analytics" ? `${activeColor} ${activeTextColor}` : ""
          }`}
        >
          <FaChartBar className="mr-3" /> Análisis
        </button>

        {/* 4. El botón de Logout se ha movido FUERA del <nav> */}
      </nav>

      {/* 5. Nueva sección para el botón de Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setActivePage("logout")}
          className={`flex items-center w-full px-4 py-2 ${textColor} ${hoverColor} ${
            activePage === "logout" ? `${activeColor} ${activeTextColor}` : ""
          }`}
        >
          <FaSignOutAlt className="mr-3" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}