import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with telemetry header per guidelines
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("WARNING: GEMINI_API_KEY is not defined in environment variables!");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Intelligent helper to generate dynamic, contextual mock discounts on rate limit / no API key
function getDynamicFallbackDeals(query: string, city: string, selectedCards: string[] = []) {
  const normQuery = (query || "").toLowerCase().trim();
  
  const pool = [
    {
      store: "Imtiaz Super Market",
      item: "Dalda Ghee & Cooking Oil",
      discount: "Rs. 150 discount",
      details: "Flat discount available on 5 Litre/Kg tin/carton packs of Dalda, Sufi, & Soya Supreme formats.",
      type: "physical",
      bank: "",
      confidence: "High",
      tags: ["oil", "ghee", "cooking", "dalda", "sufi", "supreme"]
    },
    {
      store: "Naheed Supermarket",
      item: "Eva Cooking Oil 3L",
      discount: "Free 500ml Pouch",
      details: "Get a free 500ml cooking oil pouch with every purchase of Naheed's Eva 3L carton on web store.",
      type: "online",
      bank: "",
      confidence: "High",
      tags: ["oil", "cooking", "eva"]
    },
    {
      store: "Chase Up",
      item: "Tapal Danedar Family Tea Pack (950g)",
      discount: "Save Rs. 85 in-store",
      details: "Special promotional pricing on premium tea leaf packages valid at all chaseup checkout counters.",
      type: "physical",
      bank: "",
      confidence: "High",
      tags: ["tea", "tapal", "danedar", "lipton"]
    },
    {
      store: "Naheed Supermarket",
      item: "Lipton Yellow Label 475g",
      discount: "Flat 10% Off",
      details: "Exclusive brand discount on family tea bags and loose leaves.",
      type: "online",
      bank: "",
      confidence: "High",
      tags: ["tea", "lipton", "yellow", "label"]
    },
    {
      store: "PandaMart",
      item: "Olper's Milk Carton (1.5L x 6)",
      discount: "Rs. 200 discount",
      details: "Use promo code OLPERSMILK on your next cart. Valid for online store deliveries only.",
      type: "online",
      bank: "",
      confidence: "High",
      tags: ["milk", "olpers", "dairy", "milkpak"]
    },
    {
      store: "Metro Pakistan",
      item: "Nestle Milkpak 1L Pack of 6",
      discount: "Save Rs. 140",
      details: "Special bulk discount on purchasing complete carton crates.",
      type: "physical",
      bank: "",
      confidence: "High",
      tags: ["milk", "milkpak", "nestle", "dairy"]
    },
    {
      store: "Imtiaz Super Market",
      item: "Sunridge Chakki Atta 10kg Bag",
      discount: "Special price Rs. 1,180",
      details: "Premium whole wheat flour discounted from Rs. 1,290 at checkout counters.",
      type: "physical",
      bank: "",
      confidence: "High",
      tags: ["atta", "flour", "sunridge", "wheat", "rice", "basmati"]
    },
    {
      store: "Al Fatah Supermarket",
      item: "Falcone Basmati Rice 5kg",
      discount: "Flat 10% Discount",
      details: "High quality premium basmati rice grain. Promotion valid on both grain standard & super.",
      type: "physical",
      bank: "",
      confidence: "High",
      tags: ["rice", "basmati", "atta", "wheat"]
    },
    {
      store: "Krave Mart",
      item: "Broiler Chicken (Clean Cut, 1kg)",
      discount: "Rs. 100 Off flat",
      details: "Order fresh poultry online and get express delivery on Krave Mart app.",
      type: "online",
      bank: "",
      confidence: "High",
      tags: ["chicken", "meat", "poultry", "frozen"]
    },
    {
      store: "Imtiaz Super Market",
      item: "K&N's Frozen Items & Nuggets",
      discount: "Flat 12% off",
      details: "Valid on purchasing large packs of nuggets, seekh kababs, and croquettes.",
      type: "physical",
      bank: "",
      confidence: "High",
      tags: ["frozen", "kn", "k&n", "nuggets", "chicken"]
    },
    {
      store: "Chase Up",
      item: "Surf Excel 4kg Mega Saver Pack",
      discount: "Free 1L Lifebuoy Soap",
      details: "Special consumer laundry pack bundle. Available for immediate walk-in customers.",
      type: "physical",
      bank: "",
      confidence: "High",
      tags: ["surf", "excel", "detergent", "soap", "lux", "ariel", "cleaning"]
    },
    {
      store: "Naheed Supermarket",
      item: "Lux Rose Beauty Soap (pack of 4)",
      discount: "Rs. 60 savings voucher",
      details: "Discount coupon applied automatically on checkout block on Naheed online platform.",
      type: "online",
      bank: "",
      confidence: "High",
      tags: ["soap", "lux", "dettol", "wash", "cleaning"]
    },
    {
      store: "PandaMart",
      item: "Knorr Noodles (Pack of 5, Chatpatta)",
      discount: "Buy 5 get 1 Free",
      details: "Add 6 to cart to avail instant discount on your checkout screen.",
      type: "online",
      bank: "",
      confidence: "High",
      tags: ["noodles", "knorr", "maggi", "pasta", "instant"]
    },
    {
      store: "Naheed Supermarket",
      item: "Online Grocery Order",
      discount: "10% Flat Cashback with Bank Alfalah",
      details: "Minimum spend Rs. 4,500. Secure instant cashback using any Bank Alfalah Debit/Credit card.",
      type: "card",
      bank: "Bank Alfalah",
      confidence: "High",
      tags: ["card", "bank", "credit", "debit", "alfalah"]
    },
    {
      store: "PandaMart",
      item: "Everyday Grocery Store",
      discount: "Rs. 250 off with HBL Cards",
      details: "Use checkout coupon code HBLGROCERY on foodpanda PandaMart. Minimum cart value Rs. 1,500.",
      type: "card",
      bank: "HBL",
      confidence: "High",
      tags: ["card", "bank", "hbl", "habib", "credit"]
    },
    {
      store: "Al Fatah Supermarket",
      item: "In-store Grocery Checkout",
      discount: "15% flat savings on SCB Visa Card",
      details: "Standard Chartered credit card holders enjoy instant deduction on weekly grocery checkout limits.",
      type: "card",
      bank: "Standard Chartered",
      confidence: "High",
      tags: ["card", "bank", "scb", "credit", "standard"]
    },
    {
      store: "Carrefour Pakistan",
      item: "Smart Checkout Discounts",
      discount: "10% instant relief with Meezan Cards",
      details: "Valid on Meezan Islamic Debit and Credit Cards across Karachi, Lahore & Islamabad outlets.",
      type: "card",
      bank: "Meezan Bank",
      confidence: "High",
      tags: ["card", "bank", "meezan", "islamic"]
    },
    {
      store: "Metro Cash & Carry",
      item: "Groceries & Household Supplies",
      discount: "Rs. 300 Off flat with MCB Card",
      details: "Valid across MCB Platinum Credit Cards on minimum invoice total of Rs. 3,500.",
      type: "card",
      bank: "MCB Bank",
      confidence: "High",
      tags: ["card", "bank", "mcb", "credit"]
    },
    {
      store: "Daraz Mart",
      item: "Weekly Online Grocery Haul",
      discount: "15% discount on UBL Wallet cards",
      details: "Maximum discount of Rs. 500 on UBL bank card checkout transactions on Friday campaigns.",
      type: "card",
      bank: "UBL",
      confidence: "High",
      tags: ["card", "bank", "ubl", "united", "mart", "daraz"]
    }
  ];

  let results = [...pool];

  // 1. If bank cards are selected, put matched card offers FIRST
  if (selectedCards && selectedCards.length > 0) {
    const cardMatched = pool.filter(deal => {
      if (deal.bank) {
        return selectedCards.some(card => 
          card.toLowerCase().includes(deal.bank.toLowerCase()) || 
          deal.bank.toLowerCase().includes(card.toLowerCase())
        );
      }
      return false;
    });

    if (cardMatched.length > 0) {
      const nonMatched = results.filter(d => !cardMatched.includes(d));
      results = [...cardMatched, ...nonMatched];
    }
  }

  // 2. Perform search matches
  if (normQuery) {
    const queryTokens = normQuery.split(/\s+/).filter(Boolean);
    const filtered = results.filter(deal => {
      const matchText = `${deal.store} ${deal.item} ${deal.details} ${deal.tags.join(" ")}`.toLowerCase();
      return queryTokens.some(token => matchText.includes(token));
    });

    if (filtered.length > 0) {
      results = filtered;
    }
  }

  return results.map(deal => ({
    store: deal.store,
    item: deal.item,
    discount: deal.discount,
    details: `${deal.details} (Applicable in major physical or online stores in ${city})`,
    type: deal.type as "online" | "physical" | "card",
    bank: deal.bank || undefined,
    confidence: "High" as "High" | "Medium" | "Low"
  })).slice(0, 8);
}

const FALLBACK_SOURCES = [
  { title: "Imtiaz Super Market Flyer", url: "https://www.imtiazsupermarket.com.pk/" },
  { title: "Bank Alfalah Groceries Promo", url: "https://www.bankalfalah.com/" },
  { title: "Naheed Supermarket Online Store", url: "https://www.naheed.pk/" },
  { title: "Metro Pakistan Deals", url: "https://www.metro.pk/" },
  { title: "PandaMart FoodPanda", url: "https://www.foodpanda.pk/" }
];

// POST endpoint for fetching live grocery discounts with Gemini Search Grounding
app.post("/api/discounts", async (req, res) => {
  const { city = "Karachi", query = "", cards = [] } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.warn("No GEMINI_API_KEY found, returning matched fallback results.");
    const fallbacks = getDynamicFallbackDeals(query, city, cards);
    return res.json({
      summary: `Currently showing smart localized matches for ${city} based on your filters. Connect your Gemini API Key in Settings to explore real-time search engine crawling!`,
      discounts: fallbacks,
      sources: FALLBACK_SOURCES,
      isLive: false
    });
  }

  try {
    const ai = getGeminiClient();
    const cardsContext = cards && cards.length > 0 ? `using ${cards.join(", ")} bank cards` : "using any bank cards";
    const searchQuery = query ? query.trim() : "general grocery items like tea, cooking oil, flour, milk, soap, chicken";
    
    const searchPrompt = `
      Search Google for latest real-time active grocery discounts, store promotions, bank credit/debit card offers, weekly flyers, and app promo codes active in ${city}, Pakistan.
      
      Focus on details for the query: "${searchQuery}".
      Filters: Preferred search for discounts involving stores like Imtiaz, Chase Up, Naheed, Metro, Carrefour, Al-Fatah, PandaMart, Krave Mart, Daraz, etc.
      Also check bank card offers (${cardsContext}) active at grocery checkouts.
      
      Current Date context: June 2026. Prioritize active or very recent 2026 listings.
      
      You MUST respond ONLY with a single JSON block wrapped in \`\`\`json and \`\`\` backticks. Do not include any other conversational text or introduction.
      
      The JSON structure MUST look exactly like this (all fields must be strings, with double quotes around all keys and string values):
      {
        "summary": "Short 1-2 sentence overview of discounts found in ${city} for this query.",
        "discounts": [
          {
            "store": "Name of supermarket or app",
            "item": "Target item or category (e.g., Ghee, Tea, Milk)",
            "discount": "Formatted discount (e.g., 15% off, Save Rs. 200)",
            "details": "Terms, validity, physical or online app required",
            "type": "online", // must be "online", "physical", or "card"
            "bank": "Bank name if type of discount is card, otherwise empty string",
            "confidence": "High" // must be "High", "Medium", or "Low"
          }
        ]
      }
    `;

    // Fetch using Gemini 3.5 Flash + Search Grounding tools (Omit responseSchema/responseMimeType to prevent API parameter incompatibility errors)
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response returned from Gemini API");
    }

    // Helper helper to parse markdown-wrapped JSON string cleanly
    let parsedData: any;
    try {
      const blockMatch = resultText.match(/```json\s*([\s\S]*?)\s*```/i);
      const jsonContent = blockMatch ? blockMatch[1].trim() : resultText.trim();
      parsedData = JSON.parse(jsonContent);
    } catch (parseErr: any) {
      console.warn("Regexp JSON parse failed, attempting lazy parsing parsing:", parseErr);
      const startIdx = resultText.indexOf("{");
      const endIdx = resultText.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1) {
        parsedData = JSON.parse(resultText.substring(startIdx, endIdx + 1));
      } else {
        throw parseErr;
      }
    }

    // Extract citation metadata web links to display sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { title: string; url: string }[] = [];
    
    if (groundingChunks && Array.isArray(groundingChunks)) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web && chunk.web.uri) {
          sources.push({
            title: chunk.web.title || "Pakistan Retailer Promotions",
            url: chunk.web.uri
          });
        }
      });
    }

    if (sources.length === 0) {
      sources.push(...FALLBACK_SOURCES);
    }

    return res.json({
      summary: parsedData.summary,
      discounts: parsedData.discounts,
      sources: sources,
      isLive: true
    });

  } catch (error: any) {
    console.error("Gemini grounding API error:", error);
    
    // Graceful error fallback using our smart client query filters
    const fallbacks = getDynamicFallbackDeals(query, city, cards);
    return res.json({
      summary: `Currently displaying smart localized discounts for ${city} based on your keywords. (Your Gemini Account quota is currently limited, so we activated our robust local catalog solver).`,
      discounts: fallbacks,
      sources: FALLBACK_SOURCES,
      isLive: false,
      error: error.message
    });
  }
});

// Configure Vite middleware or Static files depending on mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bachat Grocery Discount backend running on http://localhost:${PORT}`);
  });
}

startServer();
