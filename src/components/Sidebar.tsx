import { Home, MapPin, Users, MessageSquare, Flag, Image, ChartSpline, BookOpen, User, LogOut  } from "lucide-react";
import { motion } from "framer-motion";
import type { JSX } from "react";
import { NavLink, useLocation } from "react-router-dom";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: number;
};

const items: Item[] = [
  { icon: Home,        label: "Inicio",            path: "/home" },
  { icon: MapPin,      label: "Mapa",              path: "/map" },
  { icon: Users,       label: "Grupos AA",         path: "/grupos" },
  { icon: MessageSquare,label: "Chat",             path: "/chat" },
  { icon: Flag,        label: "Foros",             path: "/foros" },
  { icon: Image,       label: "Artículos locales", path: "/articulos" },
  { icon: ChartSpline,   label: "Gráficas",          path: "/graficas", badge: 1 },
  //{ icon: BookOpen,    label: "Recursos",          path: "/recursos" },
  { icon: User,        label: "Perfil",            path: "/dashboard" },
  { icon: LogOut,      label: "Salir",            path: "/login" },
];

export default function Sidebar(): JSX.Element {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <aside className="hidden md:block md:col-span-3 xl:col-span-2">
      <div className="sticky top-4 card p-4">
        <div className="px-2 pb-2 text-2xl font-extrabold">SobriWeb</div>

        <nav className="mt-2 space-y-1" aria-label="Navegación principal">
          {items.map(({ icon: Icon, label, badge, path }) => {
            const active = isActive(path);
            return (
              <NavLink key={path} to={path} className="block" end>
                <div
                  className={`relative w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
                    hover:bg-brand-200/40 ${active ? "bg-brand-200/30" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-1 top-1 bottom-1 w-1 rounded-full bg-brand-600"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon className="h-5 w-5 text-brand-700" />
                  <span className="flex-1 text-left">{label}</span>
                  {typeof badge === "number" && badge > 0 && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-brand-600 text-white">
                      {badge}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
