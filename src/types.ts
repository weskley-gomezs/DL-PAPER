export interface Product {
  id: string;
  name: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  description: string;
  image: string;
  badge?: string;
  features?: string[];
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
