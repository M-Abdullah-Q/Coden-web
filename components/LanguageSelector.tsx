"use client"
import * as React from "react";
import { Check, ChevronDown, Search, X, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCodeContext } from "@/providers/CodeProvider";

export default function LanguageSelector({ className }: { className?: string }) {
  const { languages, language, setLanguage, setLanguageId, boilerplates } = useCodeContext();
  
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const selectedLanguage = languages.find((lang: { value: any; }) => lang.value === language);
  
  const filteredLanguages = languages.filter((language: { label: string; }) =>
    language.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (selectedValue: string) => {
    const selectedLang = languages.find((lang) => lang.value === selectedValue);
    if (!selectedLang) return;

    setLanguage(selectedLang.value);
    setLanguageId(selectedLang.id);
    // setCode(boilerplates[selectedLang.value]);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("relative w-[280px]", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center w-full px-4 py-2.5",
          "bg-white dark:bg-background border rounded-lg",
          "hover:bg-background dark:hover:bg-background",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "transition-all duration-200 ease-in-out",
          "group relative",
          isOpen && "ring-2 ring-primary ring-offset-2"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center flex-1 min-w-0">
          <Code2 className="w-5 h-5 mr-2 text-gray-500" />
          <span className="truncate font-medium">
            {selectedLanguage ? (
              <span className="flex items-center gap-2">
                {selectedLanguage.label}
              </span>
            ) : "Select language"}
          </span>
        </div>
        <ChevronDown className={cn("w-4 h-4 ml-2 text-gray-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-background border rounded-lg shadow-lg">
          <div className="p-2 border-b dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-9 pr-4 text-sm bg-gray-50 dark:bg-background rounded-md border-0 focus:ring-2 focus:ring-primary placeholder:text-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto py-1">
            {filteredLanguages.length === 0 ? (
              <div className="px-2 py-4 text-sm text-center text-gray-500">No languages found</div>
            ) : (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleSelect(lang.value)}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm",
                    "hover:bg-gray-100 dark:hover:bg-gray-900",
                    "transition-colors duration-150",
                    language === lang.value && "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <span className="flex-1 text-left">{lang.label}</span>
                  {language === lang.value && <Check className="w-4 h-4 text-primary" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
