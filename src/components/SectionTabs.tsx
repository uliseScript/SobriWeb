import { useState, type JSX } from "react";
import { motion, LayoutGroup } from "framer-motion";

const tabs = ["Noticias", "Foro", "Artículos locales"] as const;

export default function SectionTabs(): JSX.Element {
  const [active, setActive] = useState<number>(0);
  return (
    <LayoutGroup>
      <div className="relative flex gap-2 bg-white/50 border border-white/60 rounded-2xl p-1 w-fit">
        {tabs.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={`relative z-10 px-4 py-2 rounded-2xl font-medium transition-colors ${
                selected ? "text-brand-700" : "text-slate-700"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-2xl bg-brand-200/70"
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                />
              )}
              <span className="relative">{t}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
