// import { useState } from "react";
// import { doc, updateDoc } from "firebase/firestore";
// import { db, auth } from "../firebase";
// import Alert from "./Alert";

// export default function CompleteProfileModal({ open, onClose, onCompleted }: { open: boolean; onClose: () => void; onCompleted: () => void }) {
//   const [age, setAge] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState<{type: 'success' | 'error', message: string}>({ type: 'error', message: '' });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const ageNumber = Number.parseInt(age, 10);
//     if (!Number.isFinite(ageNumber) || ageNumber <= 0) {
//       setAlertConfig({ type: 'error', message: "Edad inválida" });
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 3000);
//       return;
//     }
//     if (ageNumber < 15) {
//       setAlertConfig({ type: 'error', message: "Lo sentimos, debes tener al menos 15 años para usar SobriWeb." });
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 3000);
//       return;
//     }
//     try {
//       setLoading(true);
//       const user = auth.currentUser;
//       if (!user) throw new Error("No autenticado");
//       await updateDoc(doc(db, "users", user.uid), { 
//         age: ageNumber,
//         profileCompleted: true 
//       });
//       onCompleted();
//     } catch (err: any) {
//       setAlertConfig({ 
//         type: 'error', 
//         message: err.message || "Error al guardar" 
//       });
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       {showAlert && (
//         <Alert 
//           type={alertConfig.type} 
//           message={alertConfig.message}
//           onClose={() => setShowAlert(false)}
//         />
//       )}
//       <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-fade-in border border-gray-200">
//         <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
//         <h2 className="text-2xl font-bold mb-2 text-center text-[#7c3aed]">Completa tu perfil</h2>
//         <p className="text-gray-500 text-center mb-6">Por favor ingresa tu edad para continuar</p>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700">Edad</label>
//             <input
//               type="number"
//               min={15}
//               value={age}
//               onChange={e => setAge(e.target.value)}
//               className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-gray-50"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-xl bg-[#7c3aed] text-white py-2 font-semibold shadow hover:opacity-95 disabled:opacity-60 transition"
//           >
//             {loading ? "Guardando..." : "Guardar"}
//           </button>
//         </form>
//       </div>
//       <style>{`
//         .animate-fade-in {
//           animation: fadeInModal 0.3s ease;
//         }
//         @keyframes fadeInModal {
//           from { transform: translateY(40px) scale(0.98); opacity: 0; }
//           to { transform: translateY(0) scale(1); opacity: 1; }
//         }
//       `}</style>
//     </div>
//   );
// }


import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import Alert from "./Alert";

export default function CompleteProfileModal({
  open,
  onClose,
  onCompleted
}: { open: boolean; onClose: () => void; onCompleted: () => void }) {
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{type: 'success' | 'error', message: string}>({
    type: 'error',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ageNumber = Number.parseInt(age, 10);
    if (!Number.isFinite(ageNumber) || ageNumber <= 0) {
      setAlertConfig({ type: 'error', message: "Edad inválida" });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    if (ageNumber < 15) {
      setAlertConfig({ type: 'error', message: "Lo sentimos, debes tener al menos 15 años para usar SobriWeb." });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("No autenticado");
      await updateDoc(doc(db, "users", user.uid), {
        age: ageNumber,
        profileCompleted: true
      });
      onCompleted();
    } catch (err: any) {
      setAlertConfig({
        type: 'error',
        message: err.message || "Error al guardar"
      });
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {showAlert && (
        <Alert 
          type={alertConfig.type} 
          message={alertConfig.message}
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-fade-in border border-gray-200">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-center text-[#7c3aed]">Completa tu perfil</h2>
        <p className="text-gray-500 text-center mb-6">Por favor ingresa tu edad para continuar</p>

        {/* Desactiva validación nativa */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Edad</label>
            <input
              type="number"
              min={15}
              value={age}
              onChange={e => setAge(e.target.value)}
              onInvalid={(e) => e.preventDefault()}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7c3aed] bg-gray-50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#7c3aed] text-white py-2 font-semibold shadow hover:opacity-95 disabled:opacity-60 transition"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeInModal 0.3s ease;
        }
        @keyframes fadeInModal {
          from { transform: translateY(40px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
