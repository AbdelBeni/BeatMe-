"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import "./TopBar.css";

const regions = [
  { code: "US", flag: "🇺🇸", name: "North America" },
  { code: "EU", flag: "🇪🇺", name: "Europe" },
  { code: "AP", flag: "🌎", name: "Asia Pacific" },
  { code: "KR", flag: "KR", name: "Korea" },
  { code: "LA", flag: "🌎", name: "Latin America" },
  { code: "BR", flag: "🇧🇷", name: "Brazil" },
];

interface TopBarProps {
  totalPlayers: number;
  initialRegion: string;
  initialSearch: string;
}

export default function TopBar({
  totalPlayers,
  initialRegion,
  initialSearch,
}: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    regions.find((r) => r.code === initialRegion) || regions[0]
  );
  const [searchValue, setSearchValue] = useState(initialSearch);

  const inputRef = useRef<HTMLInputElement>(null);

  // اختصار Ctrl+K
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

  // تحديث URL
  const updateURL = (params: { region?: string; search?: string; page?: number }) => {
    const urlParams = new URLSearchParams();
    if (params.region && params.region !== "US") urlParams.set("region", params.region);
    if (params.search) urlParams.set("search", params.search);
    if (params.page && params.page > 1) urlParams.set("page", String(params.page));
    router.push(`${pathname}?${urlParams.toString()}`);
  };

  // البحث مع debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== initialSearch) {
        updateURL({
          region: selected.code,
          search: searchValue || undefined,
          page: 1,
        });
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <div className="topBar">
      <div className="First-Section">
        <div className="regionWrapper">
          <button
            type="button"
            className="regionSelect"
            onClick={() => setOpen(!open)}
          >
            {/* SVG الأرض */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <span className="selectedCode">{selected.code}</span>
            <span className="selectedName">{selected.name}</span>
            <svg
              className={`chevron ${open ? "open" : ""}`}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div className="regionDropdown">
              {regions.map((region) => (
                <button
                  key={region.code}
                  type="button"
                  className={`regionOption ${
                    selected.code === region.code ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelected(region);
                    setOpen(false);
                    updateURL({
                      region: region.code,
                      search: searchValue || undefined,
                      page: 1,
                    });
                  }}
                >
                  <span className="flag">{region.flag}</span>
                  <span className="optionCode">{region.code}</span>
                  <span className="optionName">{region.name}</span>
                  {selected.code === region.code && (
                    <svg
                      className="check"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="PlayersCount">
          <span>{totalPlayers.toLocaleString("en-US")} players</span>
        </div>
      </div>

      <div className="Second-Section">
        <label className={`search ${searchValue ? "has-value" : ""}`}>
          <Search size={18} className="search__icon" />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            ref={inputRef}
            type="text"
            placeholder="Search..."
            className="search__input"
          />
        </label>
      </div>
    </div>
  );
}