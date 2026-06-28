import { City, BankCard } from "./types";

export const PAKISTAN_CITIES: City[] = [
  { id: "karachi", name: "Karachi", urduName: "کراچی" },
  { id: "lahore", name: "Lahore", urduName: "لاہور" },
  { id: "islamabad", name: "Islamabad", urduName: "اسلام آباد" },
  { id: "rawalpindi", name: "Rawalpindi", urduName: "راولپنڈی" },
  { id: "faisalabad", name: "Faisalabad", urduName: "فیصل آباد" },
  { id: "multan", name: "Multan", urduName: "ملتان" },
  { id: "peshawar", name: "Peshawar", urduName: "پشاور" },
  { id: "quetta", name: "Quetta", urduName: "کوئٹہ" },
  { id: "sialkot", name: "Sialkot", urduName: "سیالکوٹ" },
  { id: "gujranwala", name: "Gujranwala", urduName: "گوجرانوالہ" },
  { id: "hyderabad", name: "Hyderabad", urduName: "حیدرآباد" }
];

export const BANK_CARDS: BankCard[] = [
  { id: "alfalah", name: "Bank Alfalah", color: "bg-red-600 text-white" },
  { id: "hbl", name: "HBL (Habib Bank)", color: "bg-teal-600 text-white" },
  { id: "meezan", name: "Meezan Bank", color: "bg-amber-800 text-white" },
  { id: "scb", name: "Standard Chartered", color: "bg-blue-600 text-white" },
  { id: "faysal", name: "Faysal Bank", color: "bg-cyan-700 text-white" },
  { id: "ubl", name: "UBL (United Bank)", color: "bg-blue-800 text-white" },
  { id: "mcb", name: "MCB Bank", color: "bg-emerald-700 text-white" },
  { id: "allied", name: "Allied Bank", color: "bg-orange-600 text-white" },
  { id: "silkbank", name: "Silkbank", color: "bg-indigo-600 text-white" }
];

export const QUICK_CATEGORIES = [
  { id: "all", label: "🔥 All Discounts", query: "" },
  { id: "ghee", label: "🛢️ Ghee & Cooking Oil", query: "cooking oil ghee" },
  { id: "tea", label: "☕ Tea & Tapal", query: "tea Tapal Lipton" },
  { id: "milk", label: "🥛 Milk & Olper's", query: "milk dairy Olpers Milkpak" },
  { id: "atta", label: "🌾 Atta & Flour", query: "atta wheat flour Maida" },
  { id: "chicken", label: "🍗 Chicken & Meat", query: "chicken meat K&Ns Sabroso" },
  { id: "cleaning", label: "🧼 Soap & Detergent", query: "detergent soap Ariel Surf Excel Lux" },
  { id: "instant", label: "🍜 Instant Noodles", query: "Knorr Maggi noodles" }
];
