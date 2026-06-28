import React, { useState } from "react";
import { MapPin, ShoppingBag, CreditCard, ShieldCheck, CheckCircle2, Share2, Check } from "lucide-react";
import { DiscountOffer } from "../types";

interface DiscountCardProps {
  offer: DiscountOffer;
  isCardMatched: boolean;
}

export default function DiscountCard({ offer, isCardMatched }: DiscountCardProps) {
  const [shared, setShared] = useState(false);

  // Determine backgrounds, borders, and icons based on type
  const getTypeConfig = () => {
    switch (offer.type) {
      case "card":
        return {
          titleBg: "bg-indigo-50 border-indigo-100",
          cardBorder: isCardMatched ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-zinc-200",
          badgeColor: "bg-indigo-150 text-indigo-800",
          icon: <CreditCard className="w-4 h-4 text-indigo-700" />,
          label: "Bank Card Offer"
        };
      case "online":
        return {
          titleBg: "bg-amber-50 border-amber-100",
          cardBorder: "border-zinc-200",
          badgeColor: "bg-amber-100 text-amber-800",
          icon: <ShoppingBag className="w-4 h-4 text-amber-700" />,
          label: "Online / App Deal"
        };
      case "physical":
      default:
        return {
          titleBg: "bg-emerald-50 border-emerald-100",
          cardBorder: "border-zinc-200",
          badgeColor: "bg-emerald-100 text-emerald-800",
          icon: <MapPin className="w-4 h-4 text-emerald-700" />,
          label: "In-Store Offer"
        };
    }
  };

  const config = getTypeConfig();

  // Confidence indicators as tags
  const getConfidenceBadge = () => {
    if (offer.confidence === "High") {
      return (
        <span className="inline-flex items-center space-x-1 text-[10px] h-5 bg-teal-50 text-teal-800 px-2 rounded-full border border-teal-200 font-medium whitespace-nowrap">
          <ShieldCheck className="w-3 nav-animate-pulse h-3 text-teal-600" />
          <span>Active & Verified</span>
        </span>
      );
    } else if (offer.confidence === "Medium") {
      return (
        <span className="inline-flex items-center space-x-1 text-[10px] h-5 bg-amber-50 text-amber-800 px-2 rounded-full border border-amber-200 font-medium whitespace-nowrap">
          <span>Likely Active</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center space-x-1 text-[10px] h-5 bg-zinc-50 text-zinc-600 px-2 rounded-full border border-zinc-200 font-medium whitespace-nowrap">
          <span>Unverified</span>
        </span>
      );
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const shareText = `🔥 Bachat Deal Found!\n🏪 Store: ${offer.store}\n🛒 Item: ${offer.item}\n💥 Promo: ${offer.discount}\n📝 Details: ${offer.details}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Grocery Discount at ${offer.store}`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.warn("navigator.share cancelled or unsupported", err);
        // Fallback if rejected/failed
        fallbackCopyToClipboard(shareText);
      }
    } else {
      fallbackCopyToClipboard(shareText);
    }
  };

  const fallbackCopyToClipboard = async (text: string) => {
    try {
      const shareUrl = `${text}\n\n🔍 Discover live grocery discounts across Pakistan on Bachat Finder: ${window.location.href}`;
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error("Clipboard copy fallback crashed:", err);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border ${config.cardBorder} p-5 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between h-full`}
    >
      {/* Visual match banner for selected card */}
      {isCardMatched && offer.type === "card" && (
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Card Match!</span>
        </div>
      )}

      {/* Card Content */}
      <div className="space-y-4">
        {/* Row 1: Header Store & Badges */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-sans font-bold text-[17px] text-zinc-900 tracking-tight leading-snug">
              {offer.store}
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-md px-1.5 py-0.5 mt-1 inline-block">
              {offer.item}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {getConfidenceBadge()}
          </div>
        </div>

        {/* Row 2: Discount Promo Banner */}
        <div className={`p-3 rounded-xl border ${config.titleBg} text-center`}>
          <span className="block font-sans font-extrabold text-[20px] text-zinc-900 tracking-tight">
            {offer.discount}
          </span>
        </div>

        {/* Row 3: Terms & Detail Paragraph */}
        <p className="text-xs text-zinc-650 leading-relaxed font-sans">
          {offer.details}
        </p>
      </div>

      {/* Card Footer */}
      <div className="border-t border-zinc-100 pt-3 mt-4 flex items-center justify-between">
        {/* Offer Type Badge */}
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-zinc-100 flex items-center justify-center">
            {config.icon}
          </div>
          <span className="text-[11px] font-medium text-zinc-600">{config.label}</span>
        </div>

        {/* Action icons & Bank badges */}
        <div className="flex items-center space-x-2">
          {offer.bank && (
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50/50 px-2 py-0.5 rounded-lg border border-indigo-100">
              💳 {offer.bank}
            </span>
          )}

          <button
            type="button"
            onClick={handleShare}
            className={`p-1.5 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
              shared
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-emerald-700 hover:border-emerald-200"
            }`}
            title={shared ? "Copied to clipboard!" : "Share deal with friends or family"}
          >
            {shared ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" title="Copy / Share promotion" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
