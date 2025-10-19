import { i } from "framer-motion/client";

import { useEffect, useState, type JSX } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UserProfile } from "../../type";

export default function AdminPage(): JSX.Element {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 rounded-2xl shadow bg-white max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-gray-600 mb-4">
          {firstName ? `Hola, ${firstName}. ` : "Hola. "}
          Aquí podrás gestionar contenido y usuarios.
        </p>
      </div>
    </div>
  );
}
