import { useState } from "react";
import { Lock, Settings, Eye, Rocket } from "lucide-react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductsCatalog from "./components/ProductsCatalog";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import BudgetFloat from "./components/BudgetFloat";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import ProductPage from "./components/ProductPage";
import ComingSoon from "./components/ComingSoon";
import { DataProvider, useAppContext } from "./context/DataContext";
import { Product, BudgetItem } from "./types";

function AppContent() {
  const { data, isAdminLoggedIn, setIsAdminLoggedIn, setIsAdminOpen, updateData } = useAppContext();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  
  // Segment state: 'todos', 'pessoal' or 'corporativo'
  const [selectedSegment, setSelectedSegment] = useState<"todos" | "pessoal" | "corporativo">("todos");

  // Add Item to active budget catalog
  const handleAddProductToBudget = (product: Product, quantity: number, notes?: string, theme?: string) => {
    const newItem: BudgetItem = {
      product,
      quantity,
      notes,
      theme,
    };
    
    // Check if matching product and customization exists to compound quantity
    const existingIndex = budgetItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.theme === theme &&
        item.notes === notes
    );

    if (existingIndex > -1) {
      setBudgetItems((prev) => {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      });
    } else {
      setBudgetItems((prev) => [...prev, newItem]);
    }
  };

  // Remove Item from simulation
  const handleRemoveItem = (index: number) => {
    setBudgetItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Adjust Quantity
  const handleUpdateQuantity = (index: number, quantity: number) => {
    setBudgetItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const cartItemsCount = budgetItems.reduce((acc, item) => acc + item.quantity, 0);

  // Public visitors see Coming Soon when isComingSoon is active and not logged in as Admin
  if (data.isComingSoon && !isAdminLoggedIn) {
    return (
      <>
        <ComingSoon />
        <AdminPanel />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FFF6F0] text-[#3A2439] overflow-x-hidden selection:bg-[#E8527A]/20 selection:text-[#E8527A] transition-colors" id="app_root_layout">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-[5%] -left-20 w-80 h-80 rounded-full bg-[#E8527A]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] -right-20 w-96 h-96 rounded-full bg-[#FFC947]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[65%] left-10 w-96 h-96 rounded-full bg-[#E8527A]/5 blur-3xl pointer-events-none" />

      {/* 1. Header (Navbar, controls & dynamic cart toggles with Pessoais / Corporativos) */}
      <Header
        onOpenBudgetSidebar={() => setIsBudgetOpen(true)}
        cartItemsCount={cartItemsCount}
        hasActiveProduct={!!activeProduct}
        onLeaveProductPage={() => setActiveProduct(null)}
        selectedSegment={selectedSegment}
        onSelectSegment={(segment) => setSelectedSegment(segment)}
      />

      {activeProduct ? (
        <ProductPage
          product={activeProduct}
          onBack={() => {
            setActiveProduct(null);
            setTimeout(() => {
              const el = document.getElementById("produtos");
              el?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }}
          onAddProduct={handleAddProductToBudget}
        />
      ) : (
        <>
          {/* 1. Tela de Boas-Vindas com Escolha Prioritária entre Pessoal e Corporativo */}
          <Hero 
            onOpenBudgetSidebar={() => setIsBudgetOpen(true)}
            selectedSegment={selectedSegment}
            onSelectSegment={(segment) => setSelectedSegment(segment)}
          />

          {/* 2. Catálogo Filtrado Exclusivamente por Segmento (com alternador rápido) */}
          <ProductsCatalog
            activeSegment={selectedSegment}
            onChangeSegment={(segment) => setSelectedSegment(segment)}
            onSelectProduct={(product) => {
              setActiveProduct(product);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />

          {/* 3. Prova Social: Depoimentos e Avaliações Reais de WhatsApp */}
          <Testimonials />

          {/* 4. Quem Faz com Amor e Propósito: Danyelle Lau & Ateliê */}
          <About />

          {/* 5. Formulário de Orçamento via WhatsApp e Canais Diretos */}
          <Contact />
        </>
      )}

      {/* Floating Triggers & Custom Budgets Cart Drawer */}
      <BudgetFloat
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        onOpen={() => setIsBudgetOpen(true)}
        budgetItems={budgetItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Footer com link 'Feito por Weskley Gomes' */}
      <Footer />

      {/* Floating Admin Mode Banner when site is in "Em Breve" for public */}
      {data.isComingSoon && isAdminLoggedIn && (
        <div
          className="fixed bottom-4 left-4 z-40 max-w-[calc(100vw-6rem)] bg-[#3A2439]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/15 flex flex-wrap items-center gap-2.5 text-xs font-sans"
          id="admin_coming_soon_status_bar"
        >
          <span className="inline-flex items-center gap-1.5 font-bold text-[#FFC947]">
            <Lock className="w-3.5 h-3.5" />
            Modo &ldquo;Em Breve&rdquo; ativo para o público
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              Painel
            </button>
            <button
              type="button"
              onClick={() => setIsAdminLoggedIn(false)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors cursor-pointer"
              title="Sair e visualizar a tela Em Breve que o público vê"
            >
              <Eye className="w-3 h-3" />
              Ver como Público
            </button>
            <button
              type="button"
              onClick={() => updateData({ isComingSoon: false })}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8527A] hover:bg-[#D43C65] text-white font-bold transition-colors cursor-pointer"
              title="Liberar o site completo para todos os visitantes"
            >
              <Rocket className="w-3 h-3" />
              Publicar Site
            </button>
          </div>
        </div>
      )}

      {/* Admin Control Center Drawer Overlay */}
      <AdminPanel />

    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
