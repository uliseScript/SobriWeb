import { motion } from "framer-motion";
import { useNews } from "../../hooks/useNews";
import NewsCardAdapter from "./NewsCardAdapter";
import { useState } from "react";
import NewsModal from "./NewsModal";


export default function NewsSection() {
    const news = useNews(10);
    const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {news.map((n) => (
          <NewsCardAdapter key={n.id} item={n} onOpen={setSelectedId} />
        ))}
      </motion.div>

      <NewsModal open={!!selectedId} docId={selectedId ?? undefined} onClose={() => setSelectedId(null)} />
    </>
  );
}