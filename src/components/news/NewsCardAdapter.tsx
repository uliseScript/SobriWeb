import type { NewsItem } from "../../hooks/useNews";
import { NewsCard } from "../Cards";
//MAPEA LO DE FIRESTORE A LAS PROPS DE NewsCard
//SI CAMBAIAN DATOS DENTRO DE FIRESTORE SOLO HACEMOS EL CAMBIO AQUI Y NO EN TODOS LOS LUGARES DONDE USAMOS NewsCard


type Props = {
  item: NewsItem;
  onOpen?: (id: string) => void;
};

export default function NewsCardAdapter({ item, onOpen }: Props) {
  return (
    <div
      role="button"
      onClick={() => item.id && onOpen?.(item.id)}
      className="cursor-pointer h-full"          // <-- clave
      aria-label={`Abrir ${item.titulo}`}
    >
      <NewsCard
        title={item.titulo}
        subtitle={item.subtitulo ?? ""}
        img={item.imageUrl}
      />
    </div>
  );
}
