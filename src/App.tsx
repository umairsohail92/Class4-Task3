import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ShoppingBag,
  MapPin,
  CreditCard,
  RefreshCw,
  Search,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Info
} from "lucide-react";

import Navbar from "./components/Navbar";
import SearchControls from "./components/SearchControls";
import DiscountCard from "./components/DiscountCard";
import SourcesPanel from "./components/SourcesPanel";

import { DiscountOffer, DiscountSearchResponse, City } from "./types";
import { PAKISTAN_CITIES } from "./constants";

const LOADING_STEPS = [
  "Firing up Gemini 3.5 Flash Search Engine...",
  "Crawling active discount catalogs in Pakistan...",
  "Scanning Imtiaz Super Market weekly flyers...",
  "Looking up Naheed & Chase Up special promotions...",
  "Parsing credit card checkout deals (HBL, Alfalah, Meezan)...",
  "Checking live grocery delivery codes (PandaMart, Krave Mart)...",
  "Structuring findings into optimized savings feed..."
];

export default function App() {
  const [selectedCity, setSelectedCity] = useState("karachi");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [offers, setOffers] = useState<DiscountOffer[]>([]);
  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter tabs: "all" | "physical" | "online" | "card"
  const [activeTab, setActiveTab] = useState<"all" | "physical" | "online" | "card">("all");

  // Rotating loading steps in UI
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Initial load
  useEffect(() => {
    handleSearch("", selectedCity, selectedCards);
  }, []);

  const handleSearch = async (
    searchQuery: string,
    cityId: string,
    cardsList: string[]
  ) => {
    setIsLoading(true);
    setErrorMsg(null);
    setQuery(searchQuery);

    try {
      const cityObj = PAKISTAN_CITIES.find((c) => c.id === cityId);
      const cityName = cityObj ? cityObj.name : "Karachi";

      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: cityName,
          query: searchQuery,
          cards: cardsList
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status code ${res.status}`);
      }

      const data: DiscountSearchResponse = await res.json();
      setOffers(data.discounts || []);
      setSources(data.sources || []);
      setSummary(data.summary || "");
      setIsLive(!!data.isLive);
      if (data.error) {
        console.warn("Backend reported partial error or warning:", data.error);
      }
    } catch (err: any) {
      console.error("Failed fetching discounts:", err);
      setErrorMsg("Unable to run live crawl search. Check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelectorChange = (cityId: string) => {
    setSelectedCity(cityId);
    handleSearch(query, cityId, selectedCards);
  };

  const handleCardsSelectorChange = (cardsList: string[]) => {
    setSelectedCards(cardsList);
    handleSearch(query, selectedCity, cardsList);
  };

  const currentCityObj = PAKISTAN_CITIES.find((c) => c.id === selectedCity);

  // Filter offers depending on Active Tab
  const filteredOffers = offers.filter((offer) => {
    if (activeTab === "all") return true;
    return offer.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="main-content">
        {/* App Hero / Title Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3" id="hero-heading">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-semibold shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Never pay full price on groceries again</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-zinc-900 leading-tight"
          >
            Find Live Grocery Discounts in{" "}
            <span className="text-emerald-600 block sm:inline relative">
              Pakistan
              <span className="absolute left-0 bottom-1 w-full h-1 bg-emerald-205 rounded-full -z-10"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-zinc-550 text-sm sm:text-base leading-relaxed"
          >
            Instantly lookup discounts, weekly sales flyers, and banking credit/debit card offers on household food items and toiletries.
          </motion.p>
        </section>

        {/* Dynamic Controls Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="controls-section">
          {/* Controls Column (Left) */}
          <div className="lg:col-span-5 space-y-6">
            <SearchControls
              selectedCity={selectedCity}
              onCityChange={handleCitySelectorChange}
              selectedCards={selectedCards}
              onCardsChange={handleCardsSelectorChange}
              onSearch={(q) => handleSearch(q, selectedCity, selectedCards)}
              isLoading={isLoading}
            />

            {/* Quick Helper Banner */}
            <div className="bg-emerald-500/5 text-emerald-900 rounded-2xl p-4 border border-emerald-500/10 space-y-2 text-xs">
              <span className="font-sans font-extrabold flex items-center gap-1.5 text-emerald-800">
                💡 Routine Bachat Tip:
              </span>
              <p className="leading-relaxed">
                Most supermarkets in Pakistan (Imtiaz, Chase Up, Metro) refresh their weekly flyer catalogues on Fridays. Bank cards often unlock 10% to 20% flat weekend savings at checkout.
              </p>
            </div>
          </div>

          {/* Results Column (Right) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Summary Block */}
            <div className="bg-white border border-zinc-150 p-5 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Crawl Summary for {currentCityObj?.name}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {isLive ? "🟢 Live Google Search" : "⚠️ Local Fallback Feed"}
                </span>
              </div>
              <p className="text-zinc-805 text-sm font-medium leading-relaxed font-sans">
                {isLoading ? (
                  <span className="text-zinc-400 italic">Analyzing real-time web indexes to fetch promos...</span>
                ) : (
                  summary || `Search results for discounts in ${currentCityObj?.name}.`
                )}
              </p>
            </div>

            {/* Filter Tabs Menu */}
            <div className="flex border-b border-zinc-200 overflow-x-auto no-scrollbar scroll-smooth gap-4 font-medium" id="deals-navigation">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`py-3 px-1 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "all"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                🔥 All Offers ({offers.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("physical")}
                className={`py-3 px-1 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "physical"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                <MapPin className="w-4 h-4" />
                Physical Stores ({offers.filter(o => o.type === "physical").length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("online")}
                className={`py-3 px-1 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "online"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Online Delivery ({offers.filter(o => o.type === "online").length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className={`py-3 px-1 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "card"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Bank Card Savings ({offers.filter(o => o.type === "card").length})
              </button>
            </div>

            {/* Error messaging if API fails */}
            {errorMsg && (
              <div className="bg-red-50 text-red-850 p-4 border border-red-200 rounded-xl text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <span className="font-bold">Offline Search:</span> {errorMsg}
                </div>
              </div>
            )}

            {/* Main Interactive Listing Container */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                // 1. Sleek Skeleton / Loading State
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-zinc-200 p-12 text-center flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin flex items-center justify-center"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-600 font-extrabold text-xs">
                      LIVE
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h4 className="font-sans font-bold text-zinc-800 text-base">
                      Crawling Pakistan Web Directories
                    </h4>
                    {/* Rotating system tasks */}
                    <p className="text-emerald-700 font-mono text-xs font-semibold animate-pulse">
                      {LOADING_STEPS[loadingStepIdx]}
                    </p>
                    <p className="text-zinc-400 text-xs leading-relaxed pt-2">
                      Please hold on! We use live Search Grounding of web archives, retailer flyers, and card campaigns so you receive actual valid discounts rather than simulation.
                    </p>
                  </div>
                </motion.div>
              ) : filteredOffers.length === 0 ? (
                // 2. Pure Empty State
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl border border-zinc-200 p-10 text-center space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-zinc-800 text-sm">
                      No matching discounts found
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                      Try resetting your checkout filters or searching for general ingredients like "Tapal tea", "cooking oil ghee", "atta", or "milk".
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSearch("", selectedCity, selectedCards)}
                    className="px-4 py-2 bg-zinc-800 text-white rounded-xl text-xs font-semibold hover:bg-zinc-900 active:scale-95 transition-all cursor-pointer"
                  >
                    Reset & View All Offers
                  </button>
                </motion.div>
              ) : (
                // 3. Grid of Promos
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  id="discounts-grid"
                >
                  {filteredOffers.map((offer, idx) => {
                    // Check if user selected this credit/debit card in their layout
                    const isCardMatched = offer.bank
                      ? selectedCards.some(
                          (c) =>
                            c.toLowerCase().includes(offer.bank!.toLowerCase()) ||
                            offer.bank!.toLowerCase().includes(c.toLowerCase())
                        )
                      : false;

                    return (
                      <motion.div
                        key={`${offer.store}-${offer.discount}-${idx}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                      >
                        <DiscountCard offer={offer} isCardMatched={isCardMatched} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Citation references crawled by Search */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <SourcesPanel sources={sources} isLive={isLive} />
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Styled Footer */}
      <footer className="bg-white border-t border-zinc-150 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center text-xs text-zinc-500 font-sans">
          <div>
            <span className="font-semibold text-zinc-800">Bachat Grocery PK</span> — Helping families manage routine expenses with smart grocery search.
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Gemini 3.5 & Google Search Grounding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
