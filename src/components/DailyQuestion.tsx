import { Search } from "lucide-react";
import type { JSX } from "react";

export default function DailyQuestion(): JSX.Element {
  return (
    <div className="relative z-50 card-solid p-3 flex items-center gap-3">
      <div className="relative w-full md:w-[990px]">
        <Search
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none z-10"
        />
        <input
          placeholder="describe como te sientes..."
          className="search-input search-solid pl-10"
        />
      </div>
      
    </div>
  );
}
