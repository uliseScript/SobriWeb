import { collection, onSnapshot, orderBy, query, limit as qLimit } from "firebase/firestore";
import { useEffect, useState } from "react";
import {db} from "../firebase"

//ESTE HOOK TIENE LA LOGICA DE DATOS AISLADA DE UI Y ES REUSABLE Y TESTEABLE
// ESTE HOOK ES PARA OBTENER LAS NOTICIAS DE FIRESTORE
export type NewsItem = {
    id: string;
    titulo: string;
    subtitulo?: string;
    imageUrl?: string;
    autor?: string;
    readTimeMin?: number;
    createdAt?: any;
};

export function useNews( max = 10 ) {
    const [ items, setItems] = useState<NewsItem[]>([]);

    useEffect(() => {
        const ref = collection(db, "noticias");
        const q = query(ref, orderBy("createdAt", "desc"), qLimit(max));
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id as string, ...d.data() as any}));
            setItems(data);
        });
        return () => unsub();
    }, [max]);
    return items;
}

