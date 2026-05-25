import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductsCatalog from "./components/ProductsCatalog";
import ThemesGallery from "./components/ThemesGallery";
import Differentials from "./components/Differentials";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import BudgetFloat from "./components/BudgetFloat";
import Footer from "./components/Footer";
import { Product, BudgetItem } from "./types";

export default function App() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

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
    <div className="relative min-h-screen bg-slate-50 overflow-x-hidden selection:bg-pink-100 selection:text-pink-900 transition-colors" id="app_root_layout">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-[5%] -left-20 w-72 h-72 rounded-full bg-brand-pink/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[25%] -right-20 w-80 h-80 rounded-full bg-brand-tiffany/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[60%] left-10 w-96 h-96 rounded-full bg-brand-lilac/5 blur-3xl pointer-events-none" />

      {/* 1. Header (Navbar, controls & dynamic cart toggles) */}
      <Header
        onOpenBudgetSidebar={() => setIsBudgetOpen(true)}
        cartItemsCount={cartItemsCount}
      />

      {/* 2. Hero (Primary section, visual illustration layout) */}
      <Hero onOpenBudgetSidebar={() => setIsBudgetOpen(true)} />

      {/* 3. Products Catalog (Category selection cards) */}
      <ProductsCatalog onAddProduct={handleAddProductToBudget} />

      {/* 4. Themes Gallery (Illustrative themes catalog list) */}
      <ThemesGallery />

      {/* 5. Differentials (Bento value indicators) */}
      <Differentials />

      {/* 6. About (Atelier custom timeline & biography) */}
      <About />

      {/* 7. Testimonials (Moms sliding comments) */}
      <Testimonials />

      {/* 8. Contact & DF Illustrated Map */}
      <Contact />

      {/* 9. Floating Triggers & Custom Budgets Cart Drawer */}
      <BudgetFloat
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        onOpen={() => setIsBudgetOpen(true)}
        budgetItems={budgetItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* 10. Core trademark page Footer */}
      <Footer />

    </div>
  );
}
