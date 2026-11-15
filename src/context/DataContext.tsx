import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, ThemeItem, HeroBannerItem, TestimonialPrintItem } from "../types";
import {
  PRODUCTS as DEFAULT_PRODUCTS,
  THEMES as DEFAULT_THEMES,
  WHATSAPP_NUMBER as DEFAULT_WHATSAPP_NUMBER,
  WHATSAPP_FORMATTED as DEFAULT_WHATSAPP_FORMATTED,
  INSTAGRAM_HANDLE as DEFAULT_INSTAGRAM_HANDLE,
  INSTAGRAM_URL as DEFAULT_INSTAGRAM_URL,
  CATEGORIES as DEFAULT_CATEGORIES
} from "../data";

export interface HeroTexts {
  tag: string;
  titlePrefix: string;
  titleColored: string;
  subtitle: string;
  description: string;
}

export interface AboutTexts {
  tag: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3?: string;
  floatingText: string;
}

export interface AppDataState {
  dataVersion?: number;
  logo: string;
  heroImage: string;
  heroVideo?: string;
  aboutImage: string;
  partyFavorsImage: string;
  heroBanners: HeroBannerItem[];
  testimonialPrints: TestimonialPrintItem[];
  kitGalleryFeminina: string[];
  kitGalleryMasculina: string[];
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
  isComingSoon: boolean;
  comingSoonTitle?: string;
  comingSoonSubtitle?: string;
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
const CURRENT_DATA_VERSION = 2;

export const DEFAULT_HERO_BANNERS: HeroBannerItem[] = [
  {
    id: "banner-1",
    src: "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
    title: "Lembrancinhas Clássicas Personalizadas",
    subtitle: "Papéis nobres de 180g e acabamentos acetinados"
  },
  {
    id: "banner-2",
    src: "/src/assets/images/hero_stationery_1779734437655.png",
    title: "Kits Completos para sua Comemoração",
    subtitle: "Compre em conjunto com economia e harmonia visual"
  }
];

export const DEFAULT_TESTIMONIAL_PRINTS: TestimonialPrintItem[] = [
  {
    id: "screenshot-1",
    url: "https://i.imgur.com/pd6klyB.png",
    alt: "Depoimento do WhatsApp de Cliente 1"
  },
  {
    id: "screenshot-2",
    url: "https://i.imgur.com/OGvCsV3.png",
    alt: "Depoimento do WhatsApp de Cliente 2"
  },
  {
    id: "screenshot-3",
    url: "https://i.imgur.com/OYYILEl.png",
    alt: "Depoimento do WhatsApp de Cliente 3"
  },
  {
    id: "screenshot-4",
    url: "https://i.imgur.com/cQ1hCX1.png",
    alt: "Depoimento do WhatsApp de Cliente 4"
  }
];

export const DEFAULT_KIT_GALLERY_FEMININA: string[] = [
  "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
  "/src/assets/images/caixa_milk_laco_1794613744008.jpg",
  "/src/assets/images/caixa_piramide_sushi_1794613744791.jpg",
  "/src/assets/images/hero_stationery_1779734437655.png"
];

export const DEFAULT_KIT_GALLERY_MASCULINA: string[] = [
  "/src/assets/images/caixa_piramide_sushi_1794613744791.jpg",
  "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
  "/src/assets/images/sacola_corporativa_luxo_1794613745685.jpg",
  "/src/assets/images/caixas_doces_mimos_1794613748044.jpg"
];

const defaultState: AppDataState = {
  dataVersion: CURRENT_DATA_VERSION,
  logo: "https://i.imgur.com/LiPwTKg.png",
  heroImage: "/src/assets/images/dl_magic_paper_hero_1791899151681.jpg",
  heroVideo: "https://i.imgur.com/WMweeTZ.mp4",
  aboutImage: "https://i.imgur.com/nsjJjnO.jpeg",
  partyFavorsImage: "/src/assets/images/tubete_cofrinho_marmitinha_1794613746569.jpg",
  heroBanners: [...DEFAULT_HERO_BANNERS],
  testimonialPrints: [...DEFAULT_TESTIMONIAL_PRINTS],
  kitGalleryFeminina: [...DEFAULT_KIT_GALLERY_FEMININA],
  kitGalleryMasculina: [...DEFAULT_KIT_GALLERY_MASCULINA],
  whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
  whatsappFormatted: DEFAULT_WHATSAPP_FORMATTED,
  instagramHandle: DEFAULT_INSTAGRAM_HANDLE,
  instagramUrl: DEFAULT_INSTAGRAM_URL,
  categories: [...DEFAULT_CATEGORIES],
  products: [...DEFAULT_PRODUCTS],
  themes: [...DEFAULT_THEMES],
  heroTexts: {
    tag: "Ateliê de Papelaria Personalizada ✨",
    titlePrefix: "Mágica em forma de papel:",
    titleColored: "DL MAGIC PAPER",
    subtitle: "“Personalizando com propósito.”",
    description: "Transformamos detalhes simples em experiências inesquecíveis através da nossa papelaria rica em carinho e dedicação artesanal."
  },
  aboutTexts: {
    tag: "A nossa história 🌸",
    title: "Quem Faz com Amor e Propósito",
    paragraph1: "Olá! Eu sou a Danyelle Lau. Sou casada, mãe de dois filhos e formada em Letras Português e Inglês. A minha trajetória como professora trouxe consigo um encanto profundo pelo universo da papelaria. Com a maternidade, nasceu também o forte desejo de trabalhar mais perto dos meus filhos, o que me impulsionou a transformar essa paixão em profissão.",
    paragraph2: "Foi assim que a DLPaper nasceu, com o propósito de transformar momentos especiais em memórias inesquecíveis através da papelaria personalizada. Para nós, o aniversário de uma criança — ou qualquer festa em família — é um marco único. Por isso, nossas peças são concebidas como lembranças afetivas duráveis, feitas para encantar e arrancar suspiros.",
    paragraph3: "Nosso ateliê em Brasília une tecnologia de corte precisa a processos manuais rigorosos. Da colagem impecável ao acabamento dos laços, cada detalhe carrega a nossa energia dedicada e o propósito de eternizar as suas celebrações.",
    floatingText: "Tudo feito à mão com papel e amor."
  },
  adminPassword: "admin123",
  adminUsername: "admin",
  isComingSoon: true,
  comingSoonTitle: "Nosso Novo Catálogo Está Chegando!",
  comingSoonSubtitle: "Estamos preparando uma experiência ainda mais linda e organizada com nossa linha de Papelaria Personalizada para Festas e Brindes Corporativos."
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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        const merged: AppDataState = {
          ...defaultState,
          ...parsed,
          heroVideo: parsed.heroVideo || "https://i.imgur.com/WMweeTZ.mp4",
          heroTexts: { ...defaultState.heroTexts, ...(parsed.heroTexts || {}) },
          aboutTexts: { ...defaultState.aboutTexts, ...(parsed.aboutTexts || {}) },
          heroBanners:
            Array.isArray(parsed.heroBanners) && parsed.heroBanners.length > 0
              ? parsed.heroBanners
              : [...defaultState.heroBanners],
          testimonialPrints:
            Array.isArray(parsed.testimonialPrints) && parsed.testimonialPrints.length > 0
              ? parsed.testimonialPrints
              : [...defaultState.testimonialPrints],
          kitGalleryFeminina:
            Array.isArray(parsed.kitGalleryFeminina) && parsed.kitGalleryFeminina.length > 0
              ? parsed.kitGalleryFeminina
              : [...defaultState.kitGalleryFeminina],
          kitGalleryMasculina:
            Array.isArray(parsed.kitGalleryMasculina) && parsed.kitGalleryMasculina.length > 0
              ? parsed.kitGalleryMasculina
              : [...defaultState.kitGalleryMasculina]
        };

        // One-time migration from v1 to v2 to clear old copyrighted product/theme URLs,
        // while preserving any future edits (v2+) the admin makes to all products & themes!
        if ((parsed.dataVersion || 1) < CURRENT_DATA_VERSION) {
          const customProducts = (parsed.products || []).filter(
            (p: Product) => p.id && p.id.startsWith("custom-prod-")
          );
          merged.products = [...defaultState.products, ...customProducts];

          const customThemes = (parsed.themes || []).filter(
            (t: ThemeItem) => t.id && t.id.startsWith("custom-theme-")
          );
          merged.themes = [...defaultState.themes, ...customThemes];
          merged.categories = [...defaultState.categories];
          merged.dataVersion = CURRENT_DATA_VERSION;

          if (
            merged.aboutImage === "/src/assets/images/creative_studio_1779734454290.png" ||
            merged.aboutImage === "https://i.imgur.com/OzgQoTA.png"
          ) {
            merged.aboutImage = "https://i.imgur.com/nsjJjnO.jpeg";
          }

          if (
            merged.heroImage === "/src/assets/images/hero_stationery_1779734437655.png" ||
            merged.heroImage === "https://i.imgur.com/MK4ydyR.jpeg" ||
            merged.heroImage === "https://i.imgur.com/Es3OQW6.jpeg" ||
            merged.heroImage === "https://i.imgur.com/QXmyxhn.jpeg" ||
            !merged.heroImage
          ) {
            merged.heroImage = "/src/assets/images/dl_magic_paper_hero_1791899151681.jpg";
          }
        } else {
          merged.products =
            Array.isArray(parsed.products) && parsed.products.length > 0
              ? parsed.products
              : [...defaultState.products];
          merged.themes =
            Array.isArray(parsed.themes) && parsed.themes.length > 0
              ? parsed.themes
              : [...defaultState.themes];
        }

        if (
          merged.aboutTexts.paragraph1 &&
          (merged.aboutTexts.paragraph1.includes("DL MAGIC PAPER nasceu") ||
            merged.aboutTexts.paragraph1.includes("A DL MAGIC PAPER") ||
            !merged.aboutTexts.paragraph3)
        ) {
          merged.aboutTexts = { ...defaultState.aboutTexts };
        }

        if (
          !merged.logo ||
          merged.logo === "https://i.imgur.com/fVtEcdv.png" ||
          merged.logo === "/logo-dlmagic.png" ||
          merged.logo === "https://i.imgur.com/8zQS15l.png"
        ) {
          merged.logo = "https://i.imgur.com/LiPwTKg.png";
        }

        if (merged.comingSoonSubtitle && merged.comingSoonSubtitle.includes("em camadas 3D")) {
          merged.comingSoonSubtitle = defaultState.comingSoonSubtitle;
        }

        if (merged.aboutTexts?.paragraph3 && merged.aboutTexts.paragraph3.includes("camadas 3D")) {
          merged.aboutTexts.paragraph3 = defaultState.aboutTexts.paragraph3;
        }

        if (merged.heroTexts?.description && merged.heroTexts.description.includes("em camadas")) {
          merged.heroTexts.description = defaultState.heroTexts.description;
        }

        setData(merged);
      }
    } catch (e) {
      console.error("Failed to load local storage dynamic settings", e);
    }
  }, []);

  const saveState = (newState: AppDataState) => {
    const withVersion = { ...newState, dataVersion: CURRENT_DATA_VERSION };
    setData(withVersion);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(withVersion));
    } catch (e) {
      console.error("Failed to save changes to localStorage", e);
    }
  };

  const updateData = (newData: Partial<AppDataState>) => {
    saveState({ ...data, ...newData });
  };

  const updateHeroTexts = (texts: Partial<HeroTexts>) => {
    saveState({
      ...data,
      heroTexts: { ...data.heroTexts, ...texts }
    });
  };

  const updateAboutTexts = (texts: Partial<AboutTexts>) => {
    saveState({
      ...data,
      aboutTexts: { ...data.aboutTexts, ...texts }
    });
  };

  const addProduct = (newProd: Omit<Product, "id">) => {
    const id = "custom-prod-" + Date.now();
    const productWithId: Product = { ...newProd, id };
    saveState({
      ...data,
      products: [...data.products, productWithId]
    });
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updatedProducts = data.products.map(p =>
      p.id === id ? { ...p, ...updatedFields } : p
    );
    saveState({
      ...data,
      products: updatedProducts
    });
  };

  const deleteProduct = (id: string) => {
    saveState({
      ...data,
      products: data.products.filter(p => p.id !== id)
    });
  };

  const addTheme = (newTheme: Omit<ThemeItem, "id">) => {
    const id = "custom-theme-" + Date.now();
    const themeWithId: ThemeItem = { ...newTheme, id };
    saveState({
      ...data,
      themes: [...data.themes, themeWithId]
    });
  };

  const updateTheme = (id: string, updatedFields: Partial<ThemeItem>) => {
    const updatedThemes = data.themes.map(t =>
      t.id === id ? { ...t, ...updatedFields } : t
    );
    saveState({
      ...data,
      themes: updatedThemes
    });
  };

  const deleteTheme = (id: string) => {
    saveState({
      ...data,
      themes: data.themes.filter(t => t.id !== id)
    });
  };

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
