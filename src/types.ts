export type OfferType = "online" | "physical" | "card";

export interface DiscountOffer {
  store: string;
  item: string;
  discount: string;
  details: string;
  type: OfferType;
  bank?: string;
  confidence: "High" | "Medium" | "Low";
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface DiscountSearchResponse {
  summary: string;
  discounts: DiscountOffer[];
  sources: GroundingSource[];
  isLive: boolean;
  error?: string;
}

export interface City {
  id: string;
  name: string;
  urduName: string;
}

export interface BankCard {
  id: string;
  name: string;
  color: string;
}
