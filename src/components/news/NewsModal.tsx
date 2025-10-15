import { useCallback, useState, useEffect } from "react";
import type { NewsItem } from "../../hooks/useNews";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

type Props = {
    open: boolean;
    docId?: string;
    onClose: () => void;
};

export default function NewsModal({ open, docId, onClose }: Props) {
    const [item, setItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(false);

    // cargamos el doc
    const load = useCallback(async () => {
        if (!open || !docId) return;
        setLoading(true);
        try {
            const ref = doc(db, "noticias", docId);
            const snap = await getDoc(ref);
            setItem(snap.exists() ? ({ id: snap.id, ...(snap.data() as any) }) : null);
        } finally {
            setLoading(false);
        }
    }, [open, docId]);

    useEffect(() => {
        if (open && docId) load();
    }, [open, docId, load]);

    // cerrar modal con ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Bloqueamos el scrooll de toda la pagina al abrir el modal
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    // un tipo halo que sigue el cursor
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const cssX = useTransform(mx, v => `${v}px`);
    const cssY = useTransform(my, v => `${v}px`);
    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />

                    {/* BORDE degradado visible en el panel del modal*/}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        className="relative w-full max-w-3xl"
                        initial={{ y: 20, scale: 0.98, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 12, scale: 0.98, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    >
                        {/* Wrapper que dibuja el BORDE: padding + fondo degradado animado */}
                        <div
                            className="
                             rounded-2xl p-[4px]
                                bg-gradient-to-r from-[#195b8c] via-[#338ed6] to-[#69b4f3]
                                    bg-[length:200%_200%] motion-safe:animate-gradient-move
                                        shadow-[0_0_0_1px_rgba(0,0,0,0.06)]
                                                "
                        >

                            {/* Contenido del modal */}
                            <motion.div
                                onMouseMove={onMove}
                                className="
                  relative bg-white rounded-2xl shadow-xl overflow-hidden
                  before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
                  before:bg-[radial-gradient(180px_180px_at_var(--x)_var(--y),rgb(99_102_241/0.16),transparent_70%)]
                "
                                style={
                                    {
                                        ['--x' as any]: cssX,
                                        ['--y' as any]: cssY,
                                    } as React.CSSProperties
                                }
                            >

                                <div className="flex items-start justify-between p-5 border-b">
                                    <div>
                                        <h2 className="text-xl font-semibold text-slate-800">
                                            {item?.titulo ?? "Cargando…"}
                                        </h2>
                                        {item?.autor && (
                                            <p className="text-sm text-slate-500">{item.autor}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-lg hover:bg-slate-100"
                                        aria-label="Cerrar"
                                    >
                                        ✕
                                    </button>
                                </div>


                                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                                    {loading ? (
                                        <div className="animate-pulse">
                                            <div className="h-60 bg-slate-200 rounded-xl" />
                                            <div className="mt-4 h-4 bg-slate-200 rounded w-3/4" />
                                            <div className="mt-2 h-4 bg-slate-200 rounded w-5/6" />
                                            <div className="mt-2 h-4 bg-slate-200 rounded w-2/3" />
                                        </div>
                                    ) : item ? (
                                        <>
                                            {item.imageUrl && (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.titulo}
                                                    className="w-full h-60 object-cover rounded-xl"
                                                />
                                            )}
                                            {item.subtitulo ? (
                                                <p className="text-slate-700">{item.subtitulo}</p>
                                            ) : (
                                                <p className="text-slate-500">Sin contenido adicional.</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-slate-500">No se encontró la noticia.</p>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-5 border-t flex items-center justify-end gap-2">
                                    <button
                                        className="px-4 py-2 rounded-lg bg-slate-100 text-slate-800"
                                        onClick={onClose}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
}
