import React, { useState } from "react";
import { Search, MapPin, CreditCard, ChevronRight, HelpCircle } from "lucide-react";
import { City, BankCard } from "../types";
import { PAKISTAN_CITIES, BANK_CARDS, QUICK_CATEGORIES } from "../constants";

interface SearchControlsProps {
  selectedCity: string;
  onCityChange: (cityId: string) => void;
  selectedCards: string[];
  onCardsChange: (cards: string[]) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchControls({
  selectedCity,
  onCityChange,
  selectedCards,
  onCardsChange,
  onSearch,
  isLoading
}: SearchControlsProps) {
  const [searchVal, setSearchVal] = useState("");
  const [showCardsConfig, setShowCardsConfig] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  const handleCardToggle = (cardName: string) => {
    if (selectedCards.includes(cardName)) {
      onCardsChange(selectedCards.filter((c) => c !== cardName));
    } else {
      onCardsChange([...selectedCards, cardName]);
    }
  };

  const currentCityObj = PAKISTAN_CITIES.find(c => c.id === selectedCity);

  return (
    <div className="bg-white rounded-2xl border border-zinc-150 p-5 md:p-6 shadow-sm space-y-6">
      {/* 1. Header & Location Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-sans font-semibold tracking-tight text-zinc-900">
            Tell us where you shop
          </h2>
          <p className="text-xs text-zinc-500">
            Selecting your city matches localized retail flyers (Imtiaz, Chase Up, Metro) and card promos.
          </p>
        </div>

        {/* City Dropdown Selector */}
        <div className="relative inline-flex items-center">
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-xl px-4 py-2 text-sm font-medium">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="bg-transparent focus:outline-hidden font-semibold cursor-pointer pr-4"
              id="city-selector"
            >
              {PAKISTAN_CITIES.map((city) => (
                <option key={city.id} value={city.id} className="text-zinc-800">
                  {city.name} ({city.urduName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Interactive Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-zinc-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-32 py-4 bg-zinc-50 border border-zinc-200 focus:border-emerald-500 focus:bg-white rounded-2xl text-zinc-900 placeholder:text-zinc-400 font-sans text-sm focus:outline-hidden transition-all shadow-inner"
            placeholder="Search e.g. 'cooking oil', 'Tapal tea', 'milk carton', 'Imtiaz discounts'..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-semibold rounded-xl text-xs tracking-wide transition-all shadow-sm shrink-0"
            id="search-submit-btn"
          >
            {isLoading ? "Searching..." : "Find Bachat"}
          </button>
        </div>
      </form>

      {/* 3. Multi-Select Wallet Bank Cards */}
      <div className="border border-zinc-100 rounded-xl bg-zinc-50/50 p-4">
        <button
          type="button"
          onClick={() => setShowCardsConfig(!showCardsConfig)}
          className="flex items-center justify-between w-full text-left font-sans text-sm font-medium text-zinc-700"
        >
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4.5 h-4.5 text-emerald-600" />
            <span>Select Your Bank Cards ({selectedCards.length} Selected)</span>
          </div>
          <span className="text-xs text-emerald-600 hover:underline">
            {showCardsConfig ? "Hide Bank List" : "Show Bank List to Match Promos"}
          </span>
        </button>

        {showCardsConfig && (
          <div className="mt-4">
            <p className="text-xs text-zinc-500 mb-3 leading-relaxed">
              Have bank cards? Tap them to highlight exclusive grocery discounts at checkout (HBL, Alfalah, SCB, Meezan, etc.)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {BANK_CARDS.map((card) => {
                const isSelected = selectedCards.includes(card.name);
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleCardToggle(card.name)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    <span>{card.name}</span>
                    {isSelected && <span className="text-emerald-150 text-[10px] bg-emerald-700/60 px-1.5 py-0.5 rounded ml-1">Active</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedCards.length > 0 && !showCardsConfig && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="text-xs text-zinc-400 flex items-center pr-1 font-medium">Active Cards:</span>
            {selectedCards.map((cardName) => (
              <span
                key={cardName}
                onClick={() => handleCardToggle(cardName)}
                className="text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg px-2.5 py-0.5 flex items-center gap-1 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                title="Click to remove"
              >
                {cardName} <span className="font-bold text-[9px]">×</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. Quick Shortcut Categories */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-sans">
          Popular Grocery Searches
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSearchVal(cat.query);
                onSearch(cat.query);
              }}
              className="px-3.5 py-2 text-xs font-medium rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/20 shadow-2xs active:scale-95 transition-all text-center flex items-center"
            >
              {cat.label}
              <ChevronRight className="w-3 h-3 ml-1 text-zinc-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
