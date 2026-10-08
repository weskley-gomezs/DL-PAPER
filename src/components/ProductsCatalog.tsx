import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Package, 
  Gift, 
  Cake, 
  Heart, 
  Layers, 
  SlidersHorizontal 
} from "lucide-react";
import { Product } from "../types";
import { useAppContext } from "../context/DataContext";

interface ProductsCatalogProps {
  onSelectProduct: (product: Product) => void;
}

export default function ProductsCatalog({ onSelectProduct }: ProductsCatalogProps) {
  const { data } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Synchronize category events triggered from other components
  useEffect(() => {
    const handleFilterEvent = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedCategory(customEvent.detail);
      }
    };
    window.addEventListener("filterCategory", handleFilterEvent);
    return () => window.removeEventListener("filterCategory", handleFilterEvent);
  }, []);

  // Compute all available categories from the products list ("pelo que é")
  const categoriesList = useMemo(() => {
    const uniqueCats = new Set<string>();
    data.products.forEach((p) => {
      if (p.category) uniqueCats.add(p.category);
    });
    
    // Ordered logical categories
    const ordered = ["Todos", "Kits de Caixas", "Caixas Avulsas", "Topos de Bolo", "Lembrancinhas", "Forminhas", "Toppers"];
    
    const result: string[] = ["Todos"];
    ordered.forEach((cat) => {
      if (cat !== "Todos" && uniqueCats.has(cat) && !result.includes(cat)) {
        result.push(cat);
      }
    });
    // Add any remaining categories
    uniqueCats.forEach((cat) => {
      if (!result.includes(cat)) {
        result.push(cat);
      }
    });
    
    return result;
  }, [data.products]);

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: data.products.length,
    };
    data.products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [data.products]);

  // Filter products based on category and search
  const filteredProducts = useMemo(() => {
    return data.products
      .filter((product) => {
        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const aIsKit = a.category === "Kits de Caixas" || a.name.toLowerCase().includes("kit");
        const bIsKit = b.category === "Kits de Caixas" || b.name.toLowerCase().includes("kit");
        
        // Prioritize kits first
        if (aIsKit && !bIsKit) return -1;
        if (!aIsKit && bIsKit) return 1;

        // Sort by price descending
        if (b.maxPrice !== a.maxPrice) {
          return b.maxPrice - a.maxPrice;
        }

        return a.name.localeCompare(b.name);
      });
  }, [data.products, selectedCategory, searchTerm]);

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Kits de Caixas":
        return <Gift className="w-3.5 h-3.5" />;
      case "Caixas Avulsas":
        return <Package className="w-3.5 h-3.5" />;
      case "Topos de Bolo":
        return <Cake className="w-3.5 h-3.5" />;
      case "Lembrancinhas":
        return <Heart className="w-3.5 h-3.5" />;
      case "Forminhas":
      case "Toppers":
        return <Layers className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section id="catalogo" className="py-16 sm:py-24 bg-[#FFF6F0] relative z-10 border-t border-[#3A2439]/5">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#FFC947]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8527A]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E8527A]" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#E8527A]">
              Catálogo de Produtos ✨
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3A2439] tracking-tight leading-tight">
            Nossos Personalizados Clássicos
          </h2>

          <p className="font-sans text-[#3A2439]/70 leading-relaxed font-normal text-sm sm:text-base max-w-2xl mx-auto">
            Todos os nossos itens reunidos em um só lugar. Selecione uma categoria abaixo para filtrar pelo que você procura ou explore o catálogo completo:
          </p>
        </div>

        {/* Filter and Search Controls */}
        <div className="space-y-6 mb-12">
          
          {/* Category Filter Pills ("Separado só pelo que é") */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-4xl mx-auto" id="catalog_category_pills">
            {categoriesList.map((category) => {
              const isSelected = selectedCategory === category;
              const count = categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#E8527A] text-white shadow-md shadow-[#E8527A]/25 scale-102"
                      : "bg-white text-[#3A2439]/80 border border-[#3A2439]/10 hover:border-[#E8527A]/40 hover:text-[#E8527A] hover:bg-white"
                  }`}
                  id={`cat_pill_${category.toLowerCase().replace(/\s+/g, '_')}`}
                >
                  <span className={isSelected ? "text-white" : "text-[#E8527A]"}>
                    {getCategoryIcon(category)}
                  </span>
                  <span>{category}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-white/25 text-white" : "bg-[#FFF6F0] text-[#3A2439]/60 font-semibold"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="max-w-md mx-auto relative" id="catalog_search_box">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A2439]/40 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar por nome, caixa, topo, lembrancinha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-20 py-3 bg-white border border-[#3A2439]/15 rounded-full font-sans text-[#3A2439] placeholder-[#3A2439]/40 focus:outline-hidden focus:ring-2 focus:ring-[#E8527A]/20 focus:border-[#E8527A] shadow-xs transition-all text-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#3A2439]/60 hover:text-[#E8527A] cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Active Filter Indicator */}
          <div className="flex items-center justify-between max-w-7xl mx-auto px-1 pt-1 text-xs text-[#3A2439]/60">
            <span>
              Exibindo <strong className="text-[#3A2439] font-bold">{filteredProducts.length}</strong> produtos em <strong className="text-[#E8527A] font-bold">{selectedCategory}</strong>
            </span>
            {selectedCategory !== "Todos" && (
              <button
                type="button"
                onClick={() => setSelectedCategory("Todos")}
                className="text-[#E8527A] hover:underline font-semibold cursor-pointer"
              >
                Mostrar todos os produtos
              </button>
            )}
          </div>

        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7" id="catalog_products_grid">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-[1.75rem] border border-[#3A2439]/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative cursor-pointer group overflow-hidden select-none"
                  id={`product_card_${product.id}`}
                >
                  
                  {/* Top Colorful Accent Strip */}
                  <div className="h-2.5 w-full bg-gradient-to-r from-[#E8527A] via-[#FFC947] to-[#E8527A]" />

                  {/* Card Main Body */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                    
                    <div className="space-y-4">
                      
                      {/* Image Frame with rounded corners */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FFF6F0] border border-[#3A2439]/5 shadow-inner flex items-center justify-center">
                        
                        {/* Product badge */}
                        {product.badge && (
                          <span className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs border border-[#3A2439]/10 text-[10px] font-extrabold uppercase tracking-widest text-[#E8527A] px-2.5 py-1 rounded-full shadow-xs">
                            {product.badge}
                          </span>
                        )}

                        {/* Category pill on card */}
                        <span className="absolute bottom-3 left-3 z-10 bg-[#3A2439]/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                          {product.category}
                        </span>

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />

                        {/* Hover Overview overlay */}
                        <AnimatePresence>
                          {hoveredCard === product.id && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-[#3A2439]/70 backdrop-blur-xs flex flex-col justify-end p-4 text-white text-left pointer-events-none"
                            >
                              <p className="text-xs uppercase tracking-wider font-extrabold text-[#FFC947] mb-1">
                                Detalhes do Produto
                              </p>
                              <ul className="text-[11px] space-y-1 font-normal opacity-95">
                                {product.features?.slice(0, 3).map((feat, idx) => (
                                  <li key={idx} className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC947] shrink-0" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Product Content */}
                      <div className="text-left space-y-1.5">
                        <span className="text-[11px] font-bold text-[#E8527A] uppercase tracking-wider block font-sans">
                          {product.category}
                        </span>
                        
                        <h3 className="font-serif text-lg font-bold text-[#3A2439] tracking-tight leading-snug group-hover:text-[#E8527A] transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <p className="font-sans text-xs text-[#3A2439]/70 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                    </div>

                    {/* Pricing & Pill CTA Button */}
                    <div className="mt-5 pt-3.5 border-t border-dashed border-[#3A2439]/10 space-y-3">
                      
                      <div className="flex items-baseline justify-between">
                        <span className="font-sans text-xs text-[#3A2439]/60 font-medium">
                          Preço sugerido:
                        </span>
                        <div className="text-right">
                          <span className="font-sans font-extrabold text-sm text-[#3A2439] tabular-nums">
                            {product.minPrice !== product.maxPrice 
                              ? `R$ ${product.minPrice.toFixed(2).replace(".", ",")} a R$ ${product.maxPrice.toFixed(2).replace(".", ",")}`
                              : `R$ ${product.minPrice.toFixed(2).replace(".", ",")}`}
                          </span>
                          <span className="text-[#3A2439]/50 text-[10px] font-normal font-sans block">
                            {product.category === "Kits de Caixas" || product.category === "Combos e Kits" ? "por kit" : 
                             product.category === "Forminhas" || product.category === "Toppers" ? "por pacote" : "por unidade"}
                          </span>
                        </div>
                      </div>

                      {/* Pill-shaped Button */}
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#E8527A] group-hover:bg-[#D43C65] font-sans font-bold text-xs uppercase tracking-wider text-white rounded-full shadow-sm shadow-[#E8527A]/25 transition-all group-hover:scale-[1.01] cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#FFC947]" />
                        <span>Personalizar & Pedir</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>

                    </div>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty search results block */}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-4 bg-white rounded-3xl border border-[#3A2439]/10 p-8 max-w-lg mx-auto">
              <span className="text-4xl block">✨</span>
              <h3 className="font-serif text-xl font-bold text-[#3A2439]">Nenhum produto encontrado neste filtro</h3>
              <p className="text-xs sm:text-sm font-sans text-[#3A2439]/70">
                Tente buscar outro termo ou selecione outra categoria.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("Todos");
                    setSearchTerm("");
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#E8527A] text-white text-xs font-bold font-sans shadow-xs cursor-pointer hover:bg-[#D43C65]"
                >
                  Ver Todos os Produtos
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
