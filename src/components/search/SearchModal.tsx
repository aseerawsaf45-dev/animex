"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/discover?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-secondary/50 hover:bg-secondary rounded-full transition-colors border">
          <Search className="w-4 h-4" />
          <span>Search anime...</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden bg-background/80 backdrop-blur-xl border-white/10">
        <form onSubmit={handleSearch} className="flex items-center p-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="flex-1 bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground"
          />
        </form>
        <div className="p-4 text-center text-sm text-muted-foreground">
          Press Enter to search
        </div>
      </DialogContent>
    </Dialog>
  );
}
