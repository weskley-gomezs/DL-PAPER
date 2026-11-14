export type ProductSegment = "pessoal" | "corporativo" | "ambos";

export interface Product {
  id: string;
  name: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  precoVenda?: number;
  description: string;
  image: string;
  gallery?: string[];
  badge?: string;
  features?: string[];
  segment?: ProductSegment;
  exibirNoSite?: boolean;
}

export interface HeroBannerItem {
  id: string;
  src: string;
  title: string;
  subtitle: string;
}

export interface TestimonialPrintItem {
  id: string;
  url: string;
  alt: string;
}

export interface ThemeItem {
  id: string;
  name: string;
  image: string;
  colors: string[];
  vibe: string;
}

export interface Differential {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  event: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface BudgetItem {
  product: Product;
  quantity: number;
  notes?: string;
  theme?: string;
}
