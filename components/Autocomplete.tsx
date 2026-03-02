import React, { useState, useRef, useEffect } from 'react';

interface AutocompleteProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  icon?: string;
  className?: string;
  dark?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder,
  label,
  icon,
  className = "",
  dark = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(value); // Reset to last confirmed value
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {label && (
        <span className="text-[10px] font-black text-gray-400 uppercase block mb-0.5">{label}</span>
      )}
      <div className="flex items-center w-full">
        {icon && <i className={`${icon} text-brand-orange mr-3 shrink-0`}></i>}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-transparent focus:outline-none font-bold text-sm ${dark ? 'text-gray-900' : 'text-gray-800'}`}
        />
      </div>

      {isOpen && searchTerm.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-60 overflow-y-auto z-[110] custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-orange-50 hover:text-brand-orange transition-colors border-b border-gray-50 last:border-0"
                onClick={() => {
                  onChange(opt);
                  setSearchTerm(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400 font-medium">No universities found</div>
          )}
        </div>
      )}
    </div>
  );
};