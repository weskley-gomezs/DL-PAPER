import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ThemeItem, Differential, Testimonial } from "../types";
import {
  IMAGES as DEFAULT_IMAGES,
  PRODUCTS as DEFAULT_PRODUCTS,
  THEMES as DEFAULT_THEMES,
  DIFFERENTIALS as DEFAULT_DIFFERENTIALS,
  TESTIMONIALS as DEFAULT_TESTIMONIALS,
  WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER,
  WHATSAPP_FORMATTED as DEFAULT_WHATSAPP_FORMATTED,
  INSTAGRAM_HANDLE as DEFAULT_INSTAGRAM_HANDLE,
  INSTAGRAM_URL as DEFAULT_INSTAGRAM_URL,
  CATEGORIES as DEFAULT_CATEGORIES
} from "../data";

// Hero editable text fields
export interface HeroTexts {
  tag: string;
  titlePrefix: string;
  titleColored: string;
  subtitle: string;
  description: string;
}

// About editable text fields
export interface AboutTexts {
  tag: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3?: string;
  floatingText: string;
}

// Global data state interface
export interface AppDataState {
  logo: string;
  heroImage: string;
  aboutImage: string;
  partyFavorsImage: string;
  whatsappNumber: string;
  whatsappFormatted: string;
  instagramHandle: string;
  instagramUrl: string;
  categories: string[];
  products: Product[];
  themes: ThemeItem[];
  heroTexts: HeroTexts;
  aboutTexts: AboutTexts;
  adminPassword?: string;
  adminUsername?: string;
}

interface DataContextType {
  data: AppDataState;
  updateData: (newData: Partial<AppDataState>) => void;
  updateHeroTexts: (texts: Partial<HeroTexts>) => void;
  updateAboutTexts: (texts: Partial<AboutTexts>) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTheme: (theme: Omit<ThemeItem, "id">) => void;
  updateTheme: (id: string, updatedTheme: Partial<ThemeItem>) => void;
  deleteTheme: (id: string) => void;
  resetAll: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
}

const LOCAL_STORAGE_KEY = "dl_magic_paper_admin_data";

const defaultState: AppDataState = {
  logo: "https://i.imgur.com/fVtEcdv.png",
  heroImage: "https://i.imgur.com/Es3OQW6.jpeg",
  aboutImage: "https://i.imgur.com/nsjJjnO.jpeg",
  partyFavorsImage: "/src/assets/images/party_favors_1779734471509.png",
  whatsappNumber: "5561998889577",
  whatsappFormatted: "(61) 99888-9577",
  instagramHandle: "@dlmagicpaper",
  instagramUrl: "https://instagram.com/dlmagicpaper",
  categories: [...DEFAULT_CATEGORIES],
  products: [...DEFAULT_PRODUCTS],
  themes: [...DEFAULT_THEMES],
  heroTexts: {
    tag: "Ateliê de Papelaria Personalizada ✨",
    titlePrefix: "Mágica em forma de papel:",
    titleColored: "DL MAGIC PAPER",
    subtitle: "“Personalizando com propósito.”",
    description: "Transformamos detalhes simples em experiências inesquecíveis através da nossa papelaria rica em camadas, carinho e dedicação artesanal."
  },
  aboutTexts: {
    tag: "A nossa história 🌸",
    title: "Quem Faz com Amor e Propósito",
    paragraph1: "Olá! Eu sou a Danyelle Lau. Sou casada, mãe de dois filhos e formada em Letras Português e Inglês. A minha trajetória como professora trouxe consigo um encanto profundo pelo universo da papelaria. Com a maternidade, nasceu também o forte desejo de trabalhar mais perto dos meus filhos, o que me impulsionou a transformar essa paixão em profissão.",
    paragraph2: "Foi assim que a DLPaper nasceu, com o propósito de transformar momentos especiais em memórias inesquecíveis através da papelaria personalizada. Para nós, o aniversário de uma criança — ou qualquer festa em família — é um marco único. Por isso, nossas peças são concebidas como lembranças afetivas duráveis, feitas para encantar e arrancar suspiros.",
    paragraph3: "Nosso ateliê em Brasília une tecnologia de corte precisa a processos manuais rigorosos. Da colagem impecável das camadas 3D ao acabamento dos laços, cada detalhe carrega a nossa energia dedicada e o propósito de eternizar as suas celebrações.",
    floatingText: "Tudo feito à mão com papel e amor."
  },
  adminPassword: "Dani@784512",
  adminUsername: "Danilau"
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppDataState>(defaultState);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedInState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("dl_magic_paper_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const setIsAdminLoggedIn = (loggedIn: boolean) => {
    setIsAdminLoggedInState(loggedIn);
    try {
      if (loggedIn) {
        sessionStorage.setItem("dl_magic_paper_logged_in", "true");
      } else {
        sessionStorage.removeItem("dl_magic_paper_logged_in");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Initialize data from localstorage or use default state
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Handle migration if any key is missing in parsed data
        const merged = {
          ...defaultState,
          ...parsed,
          // Deep merge sub-objects
          heroTexts: { ...defaultState.heroTexts, ...(parsed.heroTexts || {}) },
          aboutTexts: { ...defaultState.aboutTexts, ...(parsed.aboutTexts || {}) }
        };

        // Filter out any older built-in static products, and replace/prepend them with the fresh ones from defaultState.products.
        // We can identify built-in ones because they do NOT start with "custom-prod-".
        const customProducts = (parsed.products || []).filter((p: any) => p.id && p.id.startsWith("custom-prod-"));
        merged.products = [...defaultState.products, ...customProducts];

        // Filter out any older built-in static themes, and replace/prepend them with the fresh ones from defaultState.themes.
        // We can identify built-in ones because they do NOT start with "custom-theme-".
        const customThemes = (parsed.themes || []).filter((t: any) => t.id && t.id.startsWith("custom-theme-"));
        merged.themes = [...defaultState.themes, ...customThemes];

        // Ensure categories match the new categories list
        merged.categories = [...defaultState.categories];
        
        // If they had the ancient local path or old Imgur link, upgrade it to the new given Imgur link
        if (merged.aboutImage === "/src/assets/images/creative_studio_1779734454290.png" || merged.aboutImage === "https://i.imgur.com/OzgQoTA.png") {
          merged.aboutImage = "https://i.imgur.com/nsjJjnO.jpeg";
        }
        
        if (merged.heroImage === "/src/assets/images/hero_stationery_1779734437655.png" || merged.heroImage === "https://i.imgur.com/MK4ydyR.jpeg" || !merged.heroImage) {
          merged.heroImage = "https://i.imgur.com/Es3OQW6.jpeg";
        }
        
        // Automatically upgrade to the new beautiful Danyelle Lau / DLPaper story if they have the old placeholder
        if (
          merged.aboutTexts.paragraph1 && 
          (merged.aboutTexts.paragraph1.includes("DL MAGIC PAPER nasceu") || 
           merged.aboutTexts.paragraph1.includes("A DL MAGIC PAPER") ||
           !merged.aboutTexts.paragraph3)
        ) {
          merged.aboutTexts = {
            ...defaultState.aboutTexts
          };
        }
        
        setData(merged);
      }
    } catch (e) {
      console.error("Failed to load local storage dynamic settings", e);
    }
  }, []);

  // Save changes to localStorage whenever data edits occur
  const saveState = (newState: AppDataState) => {
    setData(newState);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.error("Failed to save changes to localStorage", e);
    }
  };

  const updateData = (newData: Partial<AppDataState>) => {
    const updated = { ...data, ...newData };
    saveState(updated);
  };

  const updateHeroTexts = (texts: Partial<HeroTexts>) => {
    const updated = {
      ...data,
      heroTexts: { ...data.heroTexts, ...texts }
    };
    saveState(updated);
  };

  const updateAboutTexts = (texts: Partial<AboutTexts>) => {
    const updated = {
      ...data,
      aboutTexts: { ...data.aboutTexts, ...texts }
    };
    saveState(updated);
  };

  // Product helper actions
  const addProduct = (newProd: Omit<Product, "id">) => {
    const id = "custom-prod-" + Date.now();
    const productWithId: Product = { ...newProd, id };
    const updated = {
      ...data,
      products: [...data.products, productWithId]
    };
    saveState(updated);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updatedProducts = data.products.map(p => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    const updated = {
      ...data,
      products: updatedProducts
    };
    saveState(updated);
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = data.products.filter(p => p.id !== id);
    const updated = {
      ...data,
      products: updatedProducts
    };
    saveState(updated);
  };

  // Theme helper actions
  const addTheme = (newTheme: Omit<ThemeItem, "id">) => {
    const id = "custom-theme-" + Date.now();
    const themeWithId: ThemeItem = { ...newTheme, id };
    const updated = {
      ...data,
      themes: [...data.themes, themeWithId]
    };
    saveState(updated);
  };

  const updateTheme = (id: string, updatedFields: Partial<ThemeItem>) => {
    const updatedThemes = data.themes.map(t => {
      if (t.id === id) {
        return { ...t, ...updatedFields };
      }
      return t;
    });
    const updated = {
      ...data,
      themes: updatedThemes
    };
    saveState(updated);
  };

  const deleteTheme = (id: string) => {
    const updatedThemes = data.themes.filter(t => t.id !== id);
    const updated = {
      ...data,
      themes: updatedThemes
    };
    saveState(updated);
  };

  // Reset to default preset
  const resetAll = () => {
    setData(defaultState);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        updateData,
        updateHeroTexts,
        updateAboutTexts,
        addProduct,
        updateProduct,
        deleteProduct,
        addTheme,
        updateTheme,
        deleteTheme,
        resetAll,
        isAdminOpen,
        setIsAdminOpen,
        isAdminLoggedIn,
        setIsAdminLoggedIn
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAppContext must be used within a DataProvider");
  }
  return context;
};
