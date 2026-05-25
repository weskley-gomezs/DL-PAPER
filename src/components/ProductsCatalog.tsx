import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Minus, Check, Sparkles, Heart, Info, ShoppingBag } from "lucide-react";
import { Product } from "../types";
import { PRODUCTS, CATEGORIES } from "../data";

interface ProductsCatalogProps {
  onAddProduct: (product: Product, quantity: number, notes?: string, theme?: string) => void;
}

export default function ProductsCatalog({ onAddProduct }: ProductsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});
  const [themes, setThemes] = useState<{ [productId: string]: string }>({});
  const [notes, setNotes] = useState<{ [productId: string]: string }>({});
  const [addedFeedback, setAddedFeedback] = useState<{ [productId: string]: boolean }>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Synchronize category events triggered from the Header
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

  // Filter products based on active criteria
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleIncrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const handleDecrement = (productId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const handleQuantityChange = (productId: string, val: number) => {
    const positiveVal = Math.max(1, val);
    setQuantities((prev) => ({
      ...prev,
      [productId]: positiveVal,
    }));
  };

  const handleAddClick = (product: Product) => {
    const qty = quantities[product.id] || 1;
    const selectedTheme = themes[product.id] || "";
    const selectedNote = notes[product.id] || "";
    
    // Trigger callback
    onAddProduct(product, qty, selectedNote, selectedTheme);

    // Visual feedback
    setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);

    // Reset temporary states for that product
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    setThemes((prev) => ({ ...prev, [product.id]: "" }));
    setNotes((prev) => ({ ...prev, [product.id]: "" }));
  };

  return (
    <section id="catalogo" className="py-20 lg:py-28 bg-white relative z-10">
      
      {/* Decorative floral/party graphics */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-100/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-44 h-44 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-brand-pink bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100">
            Vitrine Interativa 🛍️
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">
            Nosso Catálogo de Encantos
          </h2>
          <p className="font-sans text-slate-500 leading-relaxed font-light text-base sm:text-lg">
            Escolha as peças que deseja, configure o tema preferido e clique em <span className="font-medium text-brand-pink">Pedir agora</span> para simular os valores. Ao final, envie todo seu carrinho para nosso atendimento exclusivo do WhatsApp para fechar os detalhes!
          </p>
        </div>

        {/* Filter and Search Bar Row */}
        <div className="space-y-6 mb-12">
          
          {/* Categories Tab */}
          <div className="flex flex-wrap items-center justify-center gap-2" id="catalog_tabs">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full font-sans text-sm font-semibold transition-all cursor-pointer ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white shadow-md shadow-brand-pink/20 scale-102"
                    : "bg-slate-100 text-slate-600 hover:bg-pink-50 hover:text-brand-pink"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="max-w-md mx-auto relative" id="catalog_search_box">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Pesquisar lembrancinhas, kits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full font-sans text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink focus:bg-white transition-all text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-brand-pink"
              >
                Limpar
              </button>
            )}
          </div>

        </div>

        {/* Grid display of Products */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" id="catalog_products_grid">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const currentQty = quantities[product.id] || 1;
              const productTheme = themes[product.id] || "";
              const productNote = notes[product.id] || "";
              const isAdded = addedFeedback[product.id] || false;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="bg-slate-50/40 rounded-[2rem] border border-slate-100 p-4 flex flex-col justify-between hover:bg-white glamour-card-hover relative"
                  id={`product_card_${product.id}`}
                >
                  
                  {/* Upper details (Image & Badge) */}
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-inner group">
                      
                      {/* Product badge */}
                      {product.badge && (
                        <span className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm border border-pink-100 text-[10px] font-extrabold uppercase tracking-widest text-brand-pink px-2.5 py-1 rounded-full shadow-xs">
                          {product.badge}
                        </span>
                      )}

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Detail overview overlay on hover */}
                      <AnimatePresence>
                        {hoveredCard === product.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col justify-end p-4 text-white text-left pointer-events-none"
                          >
                            <p className="text-xs uppercase tracking-wider font-extrabold text-brand-pink mb-1">
                              Informações do Ateliê
                            </p>
                            <ul className="text-[11px] space-y-1 font-light opacity-95">
                              {product.features?.slice(0, 3).map((feat, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Product copy */}
                    <div className="text-left space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {product.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-slate-800 tracking-tight leading-tight">
                        {product.name}
                      </h3>
                      <p className="font-sans text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                        {product.description}
                      </p>
                    </div>

                  </div>

                  {/* Pricing and Action Block */}
                  <div className="mt-4 pt-4 border-t border-dashed border-slate-100 space-y-3">
                    
                    {/* Price Range */}
                    <div className="flex items-baseline justify-between">
                      <span className="font-sans text-xs text-slate-400 font-medium">Estimativa:</span>
                      <span className="font-sans font-extrabold text-lg text-slate-700">
                        R$ {product.minPrice.toFixed(0)} <span className="text-slate-400 text-xs font-normal">a</span> R$ {product.maxPrice.toFixed(0)} <span className="text-slate-400 text-[10px] font-normal font-sans block">por unidade</span>
                      </span>
                    </div>

                    {/* Mini customization input fields inside card (luxurious UX) */}
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        placeholder="Tema (ex: Stitch, Safari...)"
                        value={productTheme}
                        onChange={(e) => setThemes({ ...themes, [product.id]: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50/80 border border-slate-200/60 rounded-xl font-sans text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-brand-tiffany transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Nome / Idade / Observações"
                        value={productNote}
                        onChange={(e) => setNotes({ ...notes, [product.id]: e.target.value })}
                        className="w-full px-3 py-1.5 bg-slate-50/80 border border-slate-200/60 rounded-xl font-sans text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-brand-tiffany transition-all"
                      />
                    </div>

                    {/* Quantity Selector and CTA Grid */}
                    <div className="flex items-center gap-2">
                      
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-slate-200/80 rounded-full bg-slate-50 p-1">
                        <button
                          onClick={() => handleDecrement(product.id)}
                          className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input
                          type="number"
                          value={currentQty}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                          className="w-8 text-center text-xs font-bold text-slate-700 bg-transparent focus:outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => handleIncrement(product.id)}
                          className="p-1 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Add to current Simulation Button */}
                      <button
                        onClick={() => handleAddClick(product)}
                        disabled={isAdded}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-full font-serif font-bold text-xs shadow-xs transition-all cursor-pointer ${
                          isAdded
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-900 text-white hover:bg-pink-600 hover:scale-[1.02] shadow-md hover:shadow-pink-500/10"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Adicionado!
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Pedir agora
                          </>
                        )}
                      </button>

                    </div>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Empty search results block */}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-4">
              <p className="text-4xl">🌸</p>
              <h3 className="font-serif text-lg font-bold text-slate-700">Nenhum produto correspondente</h3>
              <p className="text-sm font-sans text-slate-400 max-w-sm mx-auto">
                Experimente buscar por "Kit", "Topo" ou navegue pelas abas superiores de categorias.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("Todos");
                  setSearchTerm("");
                }}
                className="text-xs font-bold font-sans text-brand-pink underline"
              >
                Resetar Filtros
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
