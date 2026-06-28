import { Sparkles, BadgePercent } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-zinc-150 bg-white sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* App Branding */}
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-sm flex items-center justify-center">
            <BadgePercent className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-sans font-bold text-lg text-emerald-800 tracking-tight">Bachat Grocery</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-100">
                Pakistan
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-sans tracking-wide">
              Live Discount & Bank Card Promo Search
            </p>
          </div>
        </div>

        {/* Dynamic quote or subtle info */}
        <div className="hidden md:flex items-center space-x-2 text-xs text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time crawler powered by Gemini Search Grounding</span>
        </div>
      </div>
    </header>
  );
}
