import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, Sparkles, AlertCircle, ShoppingBag, Plus, Minus, Heart, ArrowRight, ZoomIn, X } from "lucide-react";
import { Product, ThemeItem } from "../types";
import { useAppContext } from "../context/DataContext";

interface ProductPageProps {
  product: Product;
  onBack: () => void;
  onAddProduct: (product: Product, quantity: number, notes?: string, theme?: string) => void;
}

export default function ProductPage({ product, onBack, onAddProduct }: ProductPageProps) {
  const { data } = useAppContext();
  
  // Custom gallery images for Kit Festas Clássico
  const femininaImages = [
    "https://i.imgur.com/MIGyVNh.jpeg",
    "https://i.imgur.com/I3ZSlWb.jpeg",
    "https://i.imgur.com/Ai1fV66.jpeg",
    "https://i.imgur.com/5qD7edf.jpeg",
    "https://i.imgur.com/NVSCT1a.jpeg",
    "https://i.imgur.com/gG7TyuB.jpeg"
  ];

  const masculinaImages = [
    "https://i.imgur.com/QxlLjKz.jpeg",
    "https://i.imgur.com/OtVDS5s.jpeg",
    "https://i.imgur.com/boQBgeb.jpeg",
    "https://i.imgur.com/mYMClJY.jpeg",
    "https://i.imgur.com/XyHjuCE.jpeg",
    "https://i.imgur.com/nIOVoqq.jpeg"
  ];

  // Set default quantities according to product specifications (minimum constraints)
  const getMinQuantity = () => {
    if (product.category === "Forminhas" || product.category === "Toppers") return 20;
    if (product.category === "Lembrancinhas") return 10;
    if (product.category === "Kits de Caixas") return 15; // default kit selection
    return 1;
  };

  const [quantity, setQuantity] = useState<number>(getMinQuantity());
  const [selectedLaco, setSelectedLaco] = useState<"com-laco" | "sem-laco">("com-laco");
  const [personName, setPersonName] = useState("");
  const [personAge, setPersonAge] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  
  // Custom states for Forminhas & Toppers
  const [forminhasStyle, setForminhasStyle] = useState<"simples" | "premium">("simples");
  const [toppersStyle, setToppersStyle] = useState<"simples" | "dupla">("simples");
  const [kitQty, setKitQty] = useState<15 | 20 | 25 | 30 | 35 | 40 | 45 | 50>(15);
  
  const [activeGenderTab, setActiveGenderTab] = useState<"feminina" | "masculina">("feminina");
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Sync state if forminhas or toppers size gets clicked
  const isForminhas = product.id === "forminhas-custom";
  const isToppers = product.id === "toppers-custom";
  const isKit = product.id === "kit-caixas-custom";

  const currentGallery = activeGenderTab === "feminina" ? femininaImages : masculinaImages;

  const getProductGallery = () => {
    if (isKit) {
      return activeGenderTab === "feminina" ? femininaImages : masculinaImages;
    }
    // Individual products can have custom mini galleries
    if (product.id === "caixa-milk") {
      return [
        product.image,
        "https://i.imgur.com/I3ZSlWb.jpeg", // close up bow detail
        "https://i.imgur.com/MIGyVNh.jpeg" // decoration context
      ];
    }
    if (product.id === "caixa-bala") {
      return [
        product.image,
        "https://www.meusarquivosdigitais.com.br/wp-content/uploads/2023/03/Caixabala-Decorada-.png",
        "https://i.imgur.com/5qD7edf.jpeg"
      ];
    }
    if (product.id === "caixa-piramide") {
      return [
        product.image,
        "https://i.imgur.com/Ai1fV66.jpeg"
      ];
    }
    if (product.id === "caixa-sushi") {
      return [
        product.image,
        "https://i.imgur.com/I3ZSlWb.jpeg"
      ];
    }
    if (product.id === "lembrancinha-tubolata-5x6") {
      return [
        product.image,
        "https://i.imgur.com/gG7TyuB.jpeg",
        "https://i.imgur.com/nIOVoqq.jpeg"
      ];
    }
    return [product.image];
  };

  const activeGallery = getProductGallery();
  
  // We check if the product has a bow option (either category is Caixas Avulsas, or it is the Tubolata Lembrancinha)
  const hasLacoOption = product.category === "Caixas Avulsas" || product.id === "lembrancinha-tubolata-5x6";

  const getProductImage = () => {
    const gallery = getProductGallery();
    const imgUrl = gallery[activeImageIndex] || gallery[0] || product.image;
    if (product.id === "caixa-bala" && selectedLaco === "sem-laco" && activeImageIndex === 0) {
      return "https://www.meusarquivosdigitais.com.br/wp-content/uploads/2023/03/Caixabala-Decorada-.png";
    }
    return imgUrl;
  };

  const getForminhasPrice = (qty: number, style: string) => {
    if (qty === 20) return style === "simples" ? 6.90 : 9.90;
    if (qty === 30) return style === "simples" ? 9.90 : 14.90;
    if (qty === 50) return style === "simples" ? 15.90 : 24.90;
    if (qty === 100) return style === "simples" ? 29.90 : 44.90;
    return 6.90;
  };

  const getToppersPrice = (qty: number, style: string) => {
    if (qty === 20) return style === "simples" ? 7.90 : 12.90;
    if (qty === 30) return style === "simples" ? 10.90 : 17.90;
    if (qty === 50) return style === "simples" ? 17.90 : 27.90;
    if (qty === 100) return style === "simples" ? 34.90 : 54.90;
    return 7.90;
  };

  const getKitPrice = (qty: number) => {
    if (qty === 15) return 22.90;
    if (qty === 20) return 30.50;
    if (qty === 25) return 38.90;
    if (qty === 30) return 45.90;
    if (qty === 35) return 53.90;
    if (qty === 40) return 61.90;
    if (qty === 45) return 68.90;
    if (qty === 50) return 76.90;
    return 22.90;
  };

  const getKitDistribution = (qty: number) => {
    if (qty === 15) return { semLaco: 9, comLaco: 6 };
    if (qty === 20) return { semLaco: 12, comLaco: 8 };
    if (qty === 25) return { semLaco: 15, comLaco: 10 };
    if (qty === 30) return { semLaco: 18, comLaco: 12 };
    if (qty === 35) return { semLaco: 21, comLaco: 14 };
    if (qty === 40) return { semLaco: 24, comLaco: 16 };
    if (qty === 45) return { semLaco: 27, comLaco: 18 };
    if (qty === 50) return { semLaco: 30, comLaco: 20 };
    return { semLaco: 9, comLaco: 6 };
  };

  // Calculate current dynamic item unit / package price based on configuration
  const getCurrentUnitPrice = () => {
    if (isForminhas) {
      return getForminhasPrice(quantity, forminhasStyle);
    }
    if (isToppers) {
      return getToppersPrice(quantity, toppersStyle);
    }
    if (isKit) {
      return getKitPrice(kitQty);
    }
    if (hasLacoOption) {
      if (product.id === "lembrancinha-tubolata-5x6") {
        return selectedLaco === "com-laco" ? 3.90 : 3.20;
      } else {
        // Caixa Avulsa
        return selectedLaco === "com-laco" ? 1.72 : 1.40;
      }
    }
    return product.minPrice;
  };

  // Total computation
  const getSubtotal = () => {
    const unitPrice = getCurrentUnitPrice();
    if (isForminhas || isToppers || isKit) {
      // Pricing is already per pack/kit
      return unitPrice;
    }
    return unitPrice * quantity;
  };

  const handleLacoChange = (opt: "com-laco" | "sem-laco") => {
    setSelectedLaco(opt);
  };

  const handleIncrement = () => {
    if (isForminhas || isToppers) {
      const stops = [20, 30, 50, 100] as const;
      const curIdx = stops.indexOf(quantity as any);
      if (curIdx < stops.length - 1) {
        setQuantity(stops[curIdx + 1]);
      }
    } else if (isKit) {
      const stops = [15, 20, 25, 30, 35, 40, 45, 50] as const;
      const curIdx = stops.indexOf(kitQty as any);
      if (curIdx < stops.length - 1) {
        setKitQty(stops[curIdx + 1]);
      }
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    const minQ = getMinQuantity();
    if (isForminhas || isToppers) {
      const stops = [20, 30, 50, 100] as const;
      const curIdx = stops.indexOf(quantity as any);
      if (curIdx > 0) {
        setQuantity(stops[curIdx - 1]);
      }
    } else if (isKit) {
      const stops = [15, 20, 25, 30, 35, 40, 45, 50] as const;
      const curIdx = stops.indexOf(kitQty as any);
      if (curIdx > 0) {
        setKitQty(stops[curIdx - 1]);
      }
    } else {
      setQuantity((prev) => Math.max(minQ, prev - 1));
    }
  };

  const handleAddToCart = () => {
    let finalProduct = { ...product };
    const price = getCurrentUnitPrice();
    let finalQty = quantity;

    // Build the dynamic names and ids for various configurable items
    if (isForminhas) {
      finalProduct = {
        ...product,
        id: `forminhas-custom-${quantity}-${forminhasStyle}`,
        name: `Kit Forminhas - ${quantity} un. (${forminhasStyle === "simples" ? "Simples" : "Premium 3D"})`,
        minPrice: price,
        maxPrice: price,
        badge: "Configurado 3D"
      };
      finalQty = 1; // Since price represents the whole pack with chosen quantity
    } else if (isToppers) {
      finalProduct = {
        ...product,
        id: `toppers-custom-${quantity}-${toppersStyle}`,
        name: `Toppers para Docinhos - ${quantity} un. (${toppersStyle === "simples" ? "Simples" : "Dupla Camada"})`,
        minPrice: price,
        maxPrice: price,
        badge: "Configurado 3D"
      };
      finalQty = 1; // Since price is for entire package
    } else if (isKit) {
      const { semLaco, comLaco } = getKitDistribution(kitQty);
      finalProduct = {
        ...product,
        id: `kit-caixas-custom-${kitQty}-${activeGenderTab}`,
        name: `Kit Festas Clássico - ${kitQty} Caixas (${activeGenderTab === "feminina" ? "Modelo Feminino" : "Modelo Masculino"})`,
        image: getProductImage(),
        minPrice: price,
        maxPrice: price,
        description: `Kit misto completo com ${kitQty} caixas clássicas (inclui ${semLaco} Sem Laço e ${comLaco} Com Laço de cetim luxuoso). Estilo selecionado: ${activeGenderTab === "feminina" ? "Feminino" : "Masculino"}.`,
        badge: activeGenderTab === "feminina" ? "Feminina" : "Masculina"
      };
      finalQty = 1; // Price represents the whole custom kit
    } else if (hasLacoOption) {
      const optionLabel = selectedLaco === "com-laco" ? "Com Laço" : "Sem Laço";
      const cartImg = (product.id === "caixa-bala" && selectedLaco === "sem-laco")
        ? "https://www.meusarquivosdigitais.com.br/wp-content/uploads/2023/03/Caixabala-Decorada-.png"
        : product.image;
      finalProduct = {
        ...product,
        id: `${product.id}-${selectedLaco}`,
        name: `${product.name} (${optionLabel})`,
        image: cartImg,
        minPrice: price,
        maxPrice: price,
        badge: optionLabel
      };
    }

    // Compose final notes
    let noteParts = [];
    if (personName) noteParts.push(`Nome: ${personName}`);
    if (personAge) noteParts.push(`Idade: ${personAge}`);
    if (specialNotes) noteParts.push(`Observação: ${specialNotes}`);
    if (hasLacoOption) noteParts.push(`Acabamento: ${selectedLaco === "com-laco" ? "Com Laço" : "Sem Laço"}`);
    if (isForminhas) noteParts.push(`Modelo: ${forminhasStyle === "simples" ? "Simples" : "Premium 3D"}`);
    if (isToppers) noteParts.push(`Modelo: ${toppersStyle === "simples" ? "Simples" : "Dupla Camada"}`);
    if (isKit) noteParts.push(`Coleção: ${activeGenderTab === "feminina" ? "Coleção Feminina" : "Coleção Masculina"}`);
    
    const finalNoteStr = noteParts.join(" | ");
    onAddProduct(finalProduct, finalQty, finalNoteStr, undefined);

    // Success notification details
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onBack();
    }, 1800);
  };

  // When changing kitQty, sync the local quantity option just in case
  useEffect(() => {
    if (isKit) {
      setQuantity(kitQty);
    }
  }, [kitQty, isKit]);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 sm:pt-36 pb-16" id="product_detail_page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top bar back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-brand-pink font-sans text-sm font-bold shadow-xs hover:border-pink-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Catálogo
          </button>
          
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-sans font-bold text-slate-400">Ateliê Danyelle Lau</span>
            <span className="text-pink-300">•</span>
            <span className="text-[11px] font-sans font-extrabold text-brand-pink bg-pink-50 px-2.5 py-1 rounded-full border border-pink-100 uppercase tracking-widest">{product.category}</span>
          </div>
        </div>

        {/* Dynamic addition feedback card overlay */}
        <AnimatePresence>
          {addedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-emerald-500 text-white rounded-3xl font-serif text-center font-bold text-sm shadow-xl flex items-center justify-center gap-2 z-50 relative"
            >
              <Check className="w-5 h-5 bg-white/20 p-0.5 rounded-full" />
              <span>Adicionado ao orçamento com sucesso! Retornando ao catálogo...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Two-Column Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Visual Presentation Card with Interactive Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-4 sm:p-5 rounded-[2.5rem] border border-slate-200/50 shadow-sm relative overflow-hidden">
              
              {/* If it's a Kit, show the Feminino / Masculino quick selectors directly above the preview */}
              {isKit && (
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGenderTab("feminina");
                      setActiveImageIndex(0);
                    }}
                    className={`py-3 px-4 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                      activeGenderTab === "feminina"
                        ? "bg-gradient-to-r from-pink-50 to-pink-100/60 text-brand-pink border border-pink-200"
                        : "bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100"
                    }`}
                  >
                    <span>🎀</span> Coleção Feminina ({femininaImages.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGenderTab("masculina");
                      setActiveImageIndex(0);
                    }}
                    className={`py-3 px-4 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                      activeGenderTab === "masculina"
                        ? "bg-gradient-to-r from-sky-50 to-sky-100/60 text-sky-700 border border-sky-250"
                        : "bg-slate-50 text-slate-500 border border-transparent hover:bg-slate-100"
                    }`}
                  >
                    <span>💙</span> Coleção Masculina ({masculinaImages.length})
                  </button>
                </div>
              )}

              {/* Main Image View with Hover Zoom & Full Screen Trigger */}
              <div 
                className="group/mainimg relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={getProductImage()}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/mainimg:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />

                {/* Interactive magnifying glass hover card */}
                <div className="absolute inset-0 bg-black/15 opacity-0 group-hover/mainimg:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 text-slate-850 font-sans text-xs font-extrabold shadow-xl flex items-center gap-2 border border-slate-200/50 transform scale-90 group-hover/mainimg:scale-100 transition-transform duration-250">
                    <ZoomIn className="w-4 h-4 text-brand-pink" />
                    <span>Clique para Ampliar Foto</span>
                  </div>
                </div>

                {/* Floating category / gender indicator label */}
                {isKit ? (
                  <span className={`absolute top-4 left-4 text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md z-10 ${
                    activeGenderTab === "feminina" ? "bg-brand-pink" : "bg-sky-500"
                  }`}>
                    {activeGenderTab === "feminina" ? "Modelo Feminino" : "Modelo Masculino"}
                  </span>
                ) : product.badge ? (
                  <span className="absolute top-4 left-4 bg-brand-pink text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md z-10">
                    {product.badge}
                  </span>
                ) : null}

                {/* Floating "Zoom" quick action badge inside image */}
                <div className="absolute bottom-4 right-4 bg-slate-900/40 backdrop-blur-xs text-white p-2.5 rounded-full shadow-lg z-10 pointer-events-none">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Thumbnails Navigator carousel */}
              {activeGallery.length > 1 && (
                <div className="mt-4">
                  <p className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider mb-2 text-left">📸 Navegar Fotos Adicionais ({activeGallery.length}):</p>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
                    {activeGallery.map((imgUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition ${
                          activeImageIndex === index
                            ? "border-brand-pink scale-105 shadow-md"
                            : "border-slate-100 opacity-70 hover:opacity-100 hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.name} Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Atelie guarantee */}
              <div className="mt-5 p-4 bg-gradient-to-br from-pink-50/15 to-brand-pink/5 border border-pink-100/20 rounded-[1.8rem] flex items-center gap-4 text-left">
                <div className="w-11 h-11 rounded-full bg-brand-pink/10 shrink-0 flex items-center justify-center text-brand-pink text-xl">🌸</div>
                <div className="font-sans">
                  <p className="text-xs font-black text-slate-800">Garantia DL Magic Paper</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5">Nossas lembrancinhas e caixas personalizadas são feitas com corte impecável de máquina, papéis foscos/premium de alta gramatura e montagem artesanal sob medida.</p>
                </div>
              </div>
            </div>

            {/* Product Key highlights checklist */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200/50 text-left space-y-3 shadow-xs">
              <h4 className="font-serif text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-2.5">
                <Sparkles className="w-4 h-4 text-brand-pink" />
                Diferenciais do Item
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans text-slate-500">
                {product.features?.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-500 font-sans font-light">
                    <span className="w-4 h-4 rounded-full bg-brand-tiffany/10 text-brand-tiffany flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                    <span className="leading-relaxed text-[11px] font-medium">{feat}</span>
                  </li>
                ))}
                <li className="flex items-start gap-2 text-xs text-slate-500 font-sans font-light">
                  <span className="w-4 h-4 rounded-full bg-brand-tiffany/10 text-brand-tiffany flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed text-[11px] font-medium">Acabamentos e vincos impecáveis</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-500 font-sans font-light">
                  <span className="w-4 h-4 rounded-full bg-brand-tiffany/10 text-brand-tiffany flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">✓</span>
                  <span className="leading-relaxed text-[11px] font-medium">Embalado com máxima proteção</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Options, Info, Pricing & Customization (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title, Category & Premium Price Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/50 text-left space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-brand-pink bg-pink-50 border border-pink-100/60 px-3 py-1 rounded-full uppercase tracking-widest">{product.category}</span>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">Sob Encomenda</span>
              </div>
              
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-855 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* High Contrast Dynamic Price Display */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/40 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Valor Unitário Sugerido</p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-sans text-3xl font-black text-brand-pink tracking-tight">
                      R$ {getCurrentUnitPrice().toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-[11px] text-slate-500 font-sans font-bold">
                      {isForminhas || isToppers || isKit ? " / pacote" : " / unidade"}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                    {hasLacoOption ? `Com acabamento ${selectedLaco === "com-laco" ? "Com Laço Extra Luxo" : "Versão Normal Sem Laço"}` : isForminhas ? `Pacote com ${quantity} forminhas no estilo ${forminhasStyle}` : isToppers ? `Pacote com ${quantity} toppers no estilo ${toppersStyle}` : `Preço sugerido para Kit Completo` }
                  </p>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="inline-block px-2.5 py-1 bg-pink-50 border border-pink-100 rounded-lg text-brand-pink font-sans text-[10px] font-black uppercase tracking-wide">
                    Artesanal
                  </span>
                  <p className="text-[9px] text-slate-400 mt-1 font-sans">Produção: 7-15 dias</p>
                </div>
              </div>

              {/* Concise and lovely description */}
              <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* Core Configurations Section */}
            <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/50 text-left space-y-6 shadow-xs">
              
              <h3 className="font-serif text-base font-extrabold text-slate-800 tracking-tight border-b border-dashed border-slate-100 pb-3">
                1. Configurações de Papelaria
              </h3>

              {/* BOW (LAÇO) SELECTOR FOR ELIGIBLE PRODUCTS */}
              {hasLacoOption && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block">Estilo de Acabamento:</label>
                    <span className="text-[10px] font-sans font-bold text-slate-400">Laço de cetim luxuoso</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleLacoChange("com-laco")}
                      className={`p-4 rounded-2xl flex flex-col cursor-pointer transition text-left border ${
                        selectedLaco === "com-laco"
                          ? "bg-pink-50/50 border-brand-pink shadow-xs text-slate-800"
                          : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60 text-slate-500"
                      }`}
                    >
                      <span className="text-xs font-extrabold flex items-center gap-1.5">
                        <Heart className={`w-3.5 h-3.5 ${selectedLaco === "com-laco" ? "fill-brand-pink text-brand-pink" : ""}`} />
                        Com Laço de Cetim
                      </span>
                      <span className="text-[10px] opacity-75 mt-0.5">Enriquecido com fita de cetim elegante e fixação manual primorosa.</span>
                      <span className="text-xs font-extrabold text-brand-pink mt-2">
                        R$ {product.id === "lembrancinha-tubolata-5x6" ? "3,90" : "1,72"} <span className="text-[9px] font-normal text-slate-400">/ un.</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLacoChange("sem-laco")}
                      className={`p-4 rounded-2xl flex flex-col cursor-pointer transition text-left border ${
                        selectedLaco === "sem-laco"
                          ? "bg-pink-50/50 border-brand-pink shadow-xs text-slate-800"
                          : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-100/60 text-slate-500"
                      }`}
                    >
                      <span className="text-xs font-extrabold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Sem Laço (Clean/Econômico)
                      </span>
                      <span className="text-[10px] opacity-75 mt-0.5">Exibe puramente todo o design temático e textura limpa da caixa.</span>
                      <span className="text-xs font-extrabold text-brand-pink mt-2">
                        R$ {product.id === "lembrancinha-tubolata-5x6" ? "3,20" : "1,40"} <span className="text-[9px] font-normal text-slate-400">/ un.</span>
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* FORMINHAS DYNAMIC STYLE SELECTOR */}
              {isForminhas && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Estilo da Forminha:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["simples", "premium"] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setForminhasStyle(style)}
                          className={`p-3.5 rounded-2xl cursor-pointer text-left border transition ${
                            forminhasStyle === style
                              ? "bg-slate-900 border-slate-900 shadow-xs text-white"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span className="text-xs font-bold block">
                            {style === "simples" ? "Linha Simples" : "Linha Premium 3D com Aplique"}
                          </span>
                          <span className={`text-[9px] font-light mt-0.5 block ${style === "simples" ? "text-slate-400" : "text-slate-300"}`}>
                            {style === "simples" ? "Papel fotográfico simples coordenado" : "Sobreposições adicionais e corte alto relevo"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Quantidade no Pacote:</label>
                    <div className="flex gap-2">
                      {([20, 30, 50, 100] as const).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQuantity(q)}
                          className={`flex-1 py-3.5 rounded-2xl text-xs font-semibold font-sans transition border cursor-pointer ${
                            quantity === q
                              ? "bg-brand-pink border-brand-pink text-white shadow-xs"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-pink-50 hover:border-pink-200"
                          }`}
                        >
                          {q} Unidades
                          <span className="block text-[8px] font-extrabold opacity-75 mt-0.5">
                            R$ {getForminhasPrice(q, forminhasStyle).toFixed(2).replace(".", ",")}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TOPPERS DYNAMIC STYLE SELECTOR */}
              {isToppers && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Estilo de Acabamento:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["simples", "dupla"] as const).map((style) => (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setToppersStyle(style)}
                          className={`p-3.5 rounded-2xl cursor-pointer text-left border transition ${
                            toppersStyle === style
                              ? "bg-slate-900 border-slate-900 shadow-xs text-white"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span className="text-xs font-bold block">
                            {style === "simples" ? "Topper Simples" : "Dupla Camada 3D"}
                          </span>
                          <span className={`text-[9px] font-light mt-0.5 block ${style === "simples" ? "text-slate-400" : "text-slate-300"}`}>
                            {style === "simples" ? "Haste acrílica com arte lisa cortada" : "Efeito 3D com sobreposição de papéis especiais"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Quantidade no Pacote:</label>
                    <div className="flex gap-2">
                      {([20, 30, 50, 100] as const).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setQuantity(q)}
                          className={`flex-1 py-3.5 rounded-2xl text-xs font-semibold font-sans transition border cursor-pointer ${
                            quantity === q
                              ? "bg-brand-pink border-brand-pink text-white shadow-xs"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-pink-50 hover:border-pink-200"
                          }`}
                        >
                          {q} Unidades
                          <span className="block text-[8px] font-extrabold opacity-75 mt-0.5">
                            R$ {getToppersPrice(q, toppersStyle).toFixed(2).replace(".", ",")}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* KIT FESTAS SELECTION */}
              {isKit && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-pink-50/40 p-3 rounded-2xl border border-pink-100/30">
                      <span className="text-[11px] font-sans font-extrabold text-brand-pink bg-white shadow-xs border border-pink-50 px-2 py-0.5 rounded-md">Vem no Kit:</span>
                      <strong className="text-[11px] font-sans text-slate-500">Milk, Bala, Pirâmide, Sushi e Mala clássicas</strong>
                    </div>
                  </div>

                  <div className="space-y-2 col-span-full">
                    <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Selecione o Tamanho do Kit:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {([15, 20, 25, 30, 35, 40, 45, 50] as const).map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setKitQty(q)}
                          className={`py-3.5 rounded-2xl text-xs font-bold transition border cursor-pointer ${
                            kitQty === q
                              ? "bg-brand-pink border-brand-pink text-white shadow-xs"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-pink-50 hover:border-pink-200"
                          }`}
                        >
                          {q} Caixas
                          <span className="block text-[8px] font-light mt-0.5">
                            R$ {getKitPrice(q).toFixed(2).replace(".", ",")}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="p-3.5 bg-brand-pink/5/20 border border-pink-100/10 rounded-2xl space-y-1.5 mt-2">
                      <p className="text-[11px] font-sans text-slate-500 font-extrabold">📌 Repartição Sugerida para Equilíbrio na Mesa:</p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                        <div className="bg-white/80 p-2 rounded-xl text-slate-600">
                          📦 {getKitDistribution(kitQty).semLaco} caixas <strong className="text-brand-pink">sem laço</strong>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl text-slate-600">
                          🎀 {getKitDistribution(kitQty).comLaco} caixas <strong className="text-brand-pink">com laço de cetim</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* QUANTITY CHANGER INPUT */}
              {!isForminhas && !isToppers && !isKit && (
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block">Quantidade de Itens:</label>
                    <span className="text-[10px] text-slate-400 font-bold font-sans">
                      {product.category === "Lembrancinhas" ? "Mínimo exigido: 10 unidades" : "Pedido mínimo: 1 unidade"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200/60 max-w-[140px] shrink-0">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 transition shadow-xs cursor-pointer select-none"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(getMinQuantity(), parseInt(e.target.value) || getMinQuantity()))}
                        className="w-12 text-center text-xs font-sans font-extrabold text-slate-700 bg-transparent focus:outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={handleIncrement}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 transition shadow-xs cursor-pointer select-none"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="font-sans text-[11px] text-slate-400 font-light flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-slate-300" />
                      Qualquer proporção de guloseimas se encaixará perfeitamente.
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Personalization Section (2) */}
            <div className="bg-gradient-to-br from-pink-50/10 to-brand-pink/5/10 p-6 sm:p-8 rounded-[2.5rem] border border-pink-100/30 text-left space-y-5 shadow-xs">
              
              <div className="flex justify-between items-baseline border-b border-dashed border-pink-100 pb-3">
                <h3 className="font-serif text-base font-extrabold text-slate-800 tracking-tight">
                  2. Personalização do Item
                </h3>
                <span className="text-[10px] text-slate-400 font-bold font-sans">Ajuste sob medida</span>
              </div>

              {/* Inputs */}
              <div className="space-y-4 pt-1 font-sans">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Nome do Aniversariante:</span>
                    <input
                      type="text"
                      placeholder="Ex: Theo, Cecília (Opcional)"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-pink-100/50 rounded-xl font-sans text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-brand-pink transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Idade que irá fazer:</span>
                    <input
                      type="text"
                      placeholder="Ex: 5 anos (Opcional)"
                      value={personAge}
                      onChange={(e) => setPersonAge(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-pink-100/50 rounded-xl font-sans text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-brand-pink transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">Observações, Tema ou Cores Desejadas:</span>
                  <textarea
                    placeholder="Ex: Gostaria no tema Safari, tons pastéis, favor colocar fita rosa..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white border border-pink-100/50 rounded-xl font-sans text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-brand-pink transition-all resize-none leading-relaxed"
                  />
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-light">
                  <span className="text-brand-pink font-extrabold uppercase">✓ Ajuste Manual</span>
                  Sua personalização e o tema serão acertados diretamente com você no WhatsApp após recebermos seu orçamento!
                </div>

              </div>
            </div>

            {/* Subtotal calculator & Cart operations CTA block */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-[2.5rem] text-left space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-36 h-36 bg-brand-tiffany/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-extrabold text-brand-pink uppercase tracking-widest">Resumo da Configuração</p>
                  <p className="font-serif text-lg font-bold tracking-tight">
                    {quantity}x {isForminhas || isToppers || isKit ? "Pacote" : "Unidades de"} • {product.name}
                  </p>
                  <p className="font-sans text-[11px] text-slate-300">
                    Acabamento: {hasLacoOption ? (selectedLaco === "com-laco" ? "Com Laço Extra Luxo" : "Versão Clean Sem Laço") : isForminhas ? (forminhasStyle === "simples" ? "Forminho Simples" : "Premium 3D") : isToppers ? (toppersStyle === "simples" ? "Topper Simples" : "Dupla Camada 3D") : "Geral"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest">Subtotal do Item</p>
                  <p className="font-sans text-2xl font-black text-brand-pink tracking-tight">
                    R$ {getSubtotal().toFixed(2).replace(".", ",")}
                  </p>
                  <span className="text-[9px] text-slate-400 block font-sans">
                    {isForminhas || isToppers || isKit ? "Preço do lote completo" : `R$ ${getCurrentUnitPrice().toFixed(2).replace(".", ",")} por un.`}
                  </span>
                </div>
              </div>

              {/* Action operations grid */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onBack}
                  type="button"
                  className="flex-1 py-3.5 px-6 rounded-full font-sans font-bold text-xs text-center text-slate-300 hover:text-white border border-white/20 hover:border-white transition cursor-pointer"
                >
                  Voltar ao Catálogo
                </button>

                <button
                  onClick={handleAddToCart}
                  type="button"
                  className="flex-2 py-3.5 px-6 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white rounded-full font-serif font-black text-sm tracking-wide shadow-md shadow-brand-pink/20 hover:scale-102 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar ao Orçamento</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Lightbox / Image Zoom Modal */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            >
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl" onClick={(e) => e.stopPropagation()}>
                <motion.img
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  src={getProductImage()}
                  alt={product.name}
                  className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                
                {/* Lightbox details */}
                <div className="mt-3 text-white text-center font-sans text-xs">
                  <p className="font-bold">{product.name}</p>
                  <p className="text-[10px] text-white/60 mt-0.5">Toque fora da imagem para fechar</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
