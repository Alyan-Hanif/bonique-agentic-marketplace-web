"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      <input
        type="search"
        placeholder="Search by title, brand, or style..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-neutral-200 bg-neutral-50 py-3.5 pl-12 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:outline-none"
      />
    </div>
  );
}
