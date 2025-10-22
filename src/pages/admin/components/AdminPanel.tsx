import { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";

// Definimos el tipo del partner
interface Partner {
  id: string;
  displayName?: string;
  age?: number;
  approved?: boolean;
  role?: string;
  partnerInfo?: {
    centerName?: string;
  };
}

export default function AdminPanel() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const load = async () => {
      const q = query(
        collection(db, "users"),
        where("role", "==", "partner"),
        where("approved", "==", false)
      );

      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Partner[];
      setPartners(data);
    };

    load();
  }, []);

  const approve = async (id: string) => {
    await updateDoc(doc(db, "users", id), { approved: true });
    setPartners((prev) => prev.filter((p) => p.id !== id));
    alert("✅ Partner aprobado");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Partners Pendientes</h1>

      {partners.length === 0 && <p className="text-gray-600">No hay partners pendientes.</p>}

      {partners.map((p) => (
        <div key={p.id} className="border p-3 mb-3 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">{p.partnerInfo?.centerName || "Centro sin nombre"}</h2>
          <p className="text-gray-700">
            {p.displayName || "Sin nombre"} ({p.age ?? "N/A"} años)
          </p>
          <button
            onClick={() => approve(p.id)}
            className="bg-green-600 text-white px-3 py-1 rounded mt-2 hover:bg-green-700"
          >
            Aprobar
          </button>
        </div>
      ))}
    </div>
  );
}
