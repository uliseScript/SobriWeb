import { MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import type { JSX } from "react";

type A = { icon: React.ComponentType<{ className?: string }>; label: string };
const actions: A[] = [
  { icon: MapPin, label: "Mapa" },
  { icon: Users, label: "Grupos AA" },
  
];

export default function QuickActions(): JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map(({ icon: Icon, label }) => (
        <motion.button
          key={label}
          whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(37,99,235,.18)" }}
          whileTap={{ scale: 0.98 }}
          className="card card-hover py-6 flex items-center justify-center gap-3"
          aria-label={label}
        >
          <motion.span
            aria-hidden
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          >
            <Icon className="h-6 w-6 text-brand-700" />
          </motion.span>
          <span className="font-semibold">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}
