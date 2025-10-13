import { motion, useMotionValue, useTransform } from "framer-motion";
import type { MouseEvent, JSX } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  img?: string;
  children?: React.ReactNode;
};

function TiltWrapper({ children }: { children: React.ReactNode }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useTransform(ry, [-20, 20], [8, -8]);
  const rotateY = useTransform(rx, [-20, 20], [-8, 8]);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - el.left) / el.width) * 40 - 20;
    const py = ((e.clientY - el.top) / el.height) * 40 - 20;
    rx.set(px); ry.set(py);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY }}
      onMouseMove={onMove}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}

export function NewsCard({ title, subtitle, img }: CardProps): JSX.Element {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className="card p-4 animate-fade-in-up"
    >
      <TiltWrapper>
        <div className="elevate">
          <h3 className="text-xl font-semibold">{title}</h3>
          {img && (
            <img
              src={img}
              alt=""
              className="mt-3 rounded-xl aspect-[4/3] object-cover"
            />
          )}
          {subtitle && <p className="mt-3 text-slate-700">{subtitle}</p>}
        </div>
      </TiltWrapper>
    </motion.article>
  );
}

export function FinderCard({ title, children }: CardProps): JSX.Element {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      className="card p-4 animate-fade-in-up"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mt-3 rounded-2xl bg-white/70 border border-white/60 p-3 text-slate-700"
      >
        {children}
      </motion.div>
    </motion.article>
  );
}

export function HighlightBanner(): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-0 overflow-hidden animate-fade-in-up"
    >
      <div className="flex flex-col sm:flex-row items-center">
        <div className="p-5">
          <h3 className="text-2xl font-bold">Entrenar</h3>
          <p className="text-slate-700">Busca reuniones cercanas</p>
          
        </div>
        <motion.img
          src="https://images.unsplash.com/photo-1520975922284-9d8a2b0a2c05?q=80&w=1200&auto=format&fit=crop"
          alt=""
          className="w-full sm:w-1/2 aspect-[4/1.5] object-cover"
          whileHover={{ scale: 1.03, x: -4 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
        />
      </div>
    </motion.div>
  );
}
