import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { useEffect, useState, type JSX } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { UserProfile } from "../../type";
import UserManagement from "./components/UserManagement"; 
import AdminPanel from "./components/AdminPanel";
export default function AdminPage(): JSX.Element {
  const [name, setName] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("dashboard");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //     <div className="p-8 rounded-2xl shadow bg-white max-w-xl w-full text-center">
  //       <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
  //       <p className="text-gray-600 mb-4">
  //         {firstName ? `Hola, ${firstName}. ` : "Hola. "}
  //         Aquí podrás gestionar contenido y usuarios.
  //       </p>
  //     </div>
  //   </div>
  // );
// }
return (
    <div className="bg-gray-100 font-sans min-h-screen flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 flex flex-col md:ml-64">
        <Header toggleSidebar={toggleSidebar} />

        <main className="p-6 mt-16 flex-1 overflow-y-auto">
          {/* Dashboard */}
          {activePage === "dashboard" && (
            <section>
              <div className="p-8 rounded-2xl shadow bg-white max-w-xl w-full text-center mx-auto">
                <h1 className="text-2xl font-bold mb-2">
                  Panel de Control
                </h1>
                <p className="text-gray-600 mb-4">
                  {firstName ? `Hola, ${firstName}. ` : "Hola. "}
                  Aquí podrás gestionar contenido y usuarios.
                </p>
              </div>
            </section>
          )}

          {/* --- 2. AQUÍ SE USAN TUS COMPONENTES --- */}

          {/* Página "Todos los usuarios" -> Muestra el CRUD */}
          {activePage === "all-users" && <UserManagement />}

          {/* Página "Personas en rehabilitación" */}
          {activePage === "user-rehab" && (
            <p> Contenido para Usuario en Rehabilitación</p>
          )}

          {/* Página "Personas altruistas" */}
          {activePage === "user-altruista" && <p>2</p>}

          {/* Página "Centros de rehabilitación" -> Muestra el panel de aprobación */}
          {activePage === "user-partner" && <AdminPanel />}

          {/* ...El resto de tus páginas... */}
          {activePage === "general" && <p>This is the General Settings page</p>}
          {activePage === "security" && <p>This is the Security Settings page</p>}
          {activePage === "notifications" && (
            <p>This is the Notifications page</p>
          )}
          {activePage === "analytics" && <p>This is the Analytics page</p>}
          {activePage === "logout" && <p>You have been logged out.</p>}
        </main>
      </div>
    </div>
  );
}
