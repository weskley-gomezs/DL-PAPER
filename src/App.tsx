import { useState } from "react";
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
import { DataProvider } from "./context/DataContext";
import { Product, BudgetItem } from "./types";

function AppContent() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

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

  return (
    <div className="relative min-h-screen bg-[#FFF6F0] text-[#3A2439] overflow-x-hidden selection:bg-[#E8527A]/20 selection:text-[#E8527A] transition-colors" id="app_root_layout">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-[5%] -left-20 w-80 h-80 rounded-full bg-[#E8527A]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[30%] -right-20 w-96 h-96 rounded-full bg-[#FFC947]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-[65%] left-10 w-96 h-96 rounded-full bg-[#E8527A]/5 blur-3xl pointer-events-none" />

      {/* 1. Header (Navbar, controls & dynamic cart toggles) */}
      <Header
        onOpenBudgetSidebar={() => setIsBudgetOpen(true)}
        cartItemsCount={cartItemsCount}
        hasActiveProduct={!!activeProduct}
        onLeaveProductPage={() => setActiveProduct(null)}
      />

      {activeProduct ? (
        <ProductPage
          product={activeProduct}
          onBack={() => {
            setActiveProduct(null);
            setTimeout(() => {
              const el = document.getElementById("catalogo");
              el?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }}
          onAddProduct={handleAddProductToBudget}
        />
      ) : (
        <>
          {/* 1. Tela de Boas-Vindas / Apresentação Acolhedora com Banners */}
          <Hero onOpenBudgetSidebar={() => setIsBudgetOpen(true)} />

          {/* 2. Catálogo com Todos os Produtos Separados por Categoria ("o que é") */}
          <ProductsCatalog
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
