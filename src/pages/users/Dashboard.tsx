import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UserProfile } from "../../type";
import CompleteProfileModal from "../../components/CompleteProfileModal";

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    
    const userRef = doc(db, "users", user.uid);
    
    getDoc(userRef).then((snap) => {
      if (!snap.exists()) return;
      
      const data = snap.data() as UserProfile;
      setProfile(data);
      
      // Solo mostrar el modal si la edad es 0 y el usuario no ha completado su perfil antes
      if (data.age === 0 && !data.profileCompleted) {
        setShowModal(true);
      }
    });
  }, []);

  const handleModalCompleted = () => {
    setShowModal(false);
    // Recargar perfil actualizado
    const user = auth.currentUser;
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then((snap) => {
      setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#eaf1fa] to-[#195b8c]">
      <CompleteProfileModal
        open={showModal}
        onClose={() => {}}
        onCompleted={handleModalCompleted}
      />
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden bg-white/80 md:bg-white">
        <div className="flex flex-col md:flex-row">
          {/* Left: Info usuario */}
          <div className="flex-1 flex flex-col justify-center items-center p-10 bg-white">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#195b8c] flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-white">S</span>
              </div>
              <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
                SobriWeb
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
              Dashboard
            </h2>
            <div className="w-full max-w-xs mx-auto mt-4 border rounded-2xl divide-y bg-gray-50">
              {profile ? (
                <>
                  <div className="p-4 flex justify-between">
                    <span className="text-gray-500">Nombre</span>
                    <span className="font-medium">{profile.displayName}</span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="text-gray-500">Edad</span>
                    <span className="font-medium">{profile.age}</span>
                  </div>
                  <div className="p-4 flex justify-between">
                    <span className="text-gray-500">Correo</span>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                </>
              ) : (
                <div className="p-4 text-gray-600">Cargando perfil…</div>
              )}
            </div>
            <button
              onClick={() => signOut(auth)}
              className="mt-6 w-full rounded-lg bg-[#195b8c] text-white py-2 font-semibold text-lg shadow hover:bg-[#195b8c] transition"
            >
              Cerrar sesión
            </button>
          </div>
          {/* Right: Imagen o ilustración */}
          <div className="hidden md:flex flex-1 items-center justify-center bg-gradient-to-tr from-[ #1ec9e7] to-[#195b8c]">
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="110"
                cy="110"
                r="110"
                fill="#fff"
                fillOpacity="0.08"
              />
              <ellipse
                cx="110"
                cy="120"
                rx="70"
                ry="80"
                fill="#fff"
                fillOpacity="0.12"
              />
              <rect
                x="70"
                y="80"
                width="80"
                height="80"
                rx="40"
                fill="#195b8c"
              />
              <rect
                x="100"
                y="110"
                width="20"
                height="40"
                rx="10"
                fill="#fff"
              />
              <circle cx="110" cy="105" r="15" fill="#fff" />
              <rect
                x="120"
                y="120"
                width="30"
                height="10"
                rx="5"
                fill="#fff"
              />
              <rect
                x="70"
                y="120"
                width="30"
                height="10"
                rx="5"
                fill="#fff"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
