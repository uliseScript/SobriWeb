import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setSignedIn(!!u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  if (!ready) return <div className="p-6">Cargando…</div>;
  if (!signedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
