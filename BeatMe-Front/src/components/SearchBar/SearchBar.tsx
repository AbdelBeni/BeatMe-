"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import "./SearchBar.css";

export default function SearchBar() {
 const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <label className={`search ${searchValue ? "has-value" : ""}`}>
      <Search size={18} className="search__icon" />
      <input  value={searchValue} onChange={(e) => setSearchValue(e.target.value)} 
        ref={inputRef} type="text" placeholder="Search..." className="search__input" />
    </label>
  );
}
