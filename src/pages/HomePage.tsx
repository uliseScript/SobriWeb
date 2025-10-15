import { useEffect, useState, type JSX } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import QuickActions from "../components/QuickActions";
import SectionTabs from "../components/SectionTabs";
import { NewsCard /*, FinderCard*/ } from "../components/Cards";


import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UserProfile } from "../type";
import NewsSection from "../components/news/NewsSection";

const page = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };

export default function HomePage(): JSX.Element {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;

    const fallback = u.displayName || (u.email ? u.email.split("@")[0] : null);

    getDoc(doc(db, "users", u.uid))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          const display = (data.displayName || fallback || "").trim();
          setName(display || null);
        } else {
          setName(fallback);
        }
      })
      .catch(() => setName(fallback));
  }, []);

  const firstName = name ? name.split(" ")[0] : null;

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-brand-50 to-brand-100 text-slate-900 overflow-visible">
      {/* onda svg ff*/}
      <div className="wave-strip" />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl p-4 md:p-6 grid grid-cols-12 gap-6"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <Sidebar />

        <section className="col-span-12 md:col-span-9 xl:col-span-10 space-y-6">
          <motion.div variants={page}>
            <Topbar />
          </motion.div>

          <motion.h1 variants={page} className="text-3xl md:text-4xl font-extrabold">
            {"Bienvenido"}
            {firstName ? `, ${firstName}` : ""}
            {" hijo de perra"}
          </motion.h1>

          <motion.div variants={page}><QuickActions /></motion.div>
          {/* QUITE LOS TABS PORQUE LOS VEO INNESECARIOS POR EL MOMENTO */}
          {/* <motion.div variants={page}><SectionTabs /></motion.div> */}

          {/* MOSTRAMOS LAS NOTICIAS*/}
           <motion.div variants={page}>
            <NewsSection />
          </motion.div> 
          
        </section>
      </motion.div>
    </main>
  );
}
