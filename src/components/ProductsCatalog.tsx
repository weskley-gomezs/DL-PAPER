import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Sparkles,
  Gift,
  PartyPopper,
  Briefcase,
  LayoutGrid,
  MessageCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Product } from "../types";
import { useAppContext } from "../context/DataContext";
import {
  useFirebaseProducts,
  MAX_PRODUCT_DESCRIPTION_LENGTH,
  MAX_PRODUCT_NAME_LENGTH,
} from "../hooks/useFirebaseProducts";
import {
  buildSafeWhatsAppUrl,
  isSafeImageSource,
  isValidPositivePrice,
  sanitizePlainText,
} from "../lib/security";

interface ProductsCatalogProps {
  onSelectProduct: (product: Product) => void;
  activeSegment?: "todos" | "pessoal" | "corporativo";
  onChangeSegment?: (segment: "todos" | "pessoal" | "corporativo") => void;
}

function formatPriceNumber(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPriceBRL(value: number): string {
  return `R$ ${formatPriceNumber(value)}`;
}

export default function ProductsCatalog({
  onSelectProduct,
  activeSegment = "todos",
  onChangeSegment,
}: ProductsCatalogProps) {
  const { data } = useAppContext();
  const {
    products,
    loading,
    permissionError,
    errorMessage,
    rateLimited,
    refreshProducts,
  } = useFirebaseProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Garantia adicional em camada de UI: só exibe itens públicos e com preço positivo válido
  const safeProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.exibirNoSite !== false &&
        isValidPositivePrice(p.precoVenda ?? p.minPrice)
    );
  }, [products]);

  // Contadores por linha
  const counts = useMemo(() => {
    const pessoal = safeProducts.filter(
      (p) => p.segment === "pessoal" || p.segment === "ambos" || !p.segment
    ).length;
    const corporativo = safeProducts.filter(
      (p) => p.segment === "corporativo" || p.segment === "ambos"
    ).length;
    return {
      todos: safeProducts.length,
      pessoal,
      corporativo,
    };
  }, [safeProducts]);

  // Filtro dinâmico por linha + busca textual
  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return safeProducts.filter((product) => {
      const seg = product.segment || "pessoal";
      const matchesLine =
        activeSegment === "todos"
          ? true
          : activeSegment === "pessoal"
          ? seg === "pessoal" || seg === "ambos"
          : seg === "corporativo" || seg === "ambos";

      if (!matchesLine) return false;
      if (!query) return true;

      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    });
  }, [safeProducts, activeSegment, searchTerm]);

  const handleSwitchSegment = (newSegment: "todos" | "pessoal" | "corporativo") => {
    if (onChangeSegment) {
      onChangeSegment(newSegment);
    }
    setSearchTerm("");
  };

  const buildWhatsAppOrderUrl = (product: Product) => {
    const safeName = sanitizePlainText(
      product.name,
      MAX_PRODUCT_NAME_LENGTH,
      "Produto Personalizado"
    );
    const finalPrice = product.precoVenda ?? product.minPrice ?? 0;
    const precoFormatado = formatPriceNumber(finalPrice);
    const message = `Olá! Vi o produto ${safeName} (R$ ${precoFormatado}) no site da DL Magic Paper e gostaria de fazer um orçamento.`;
    return buildSafeWhatsAppUrl(data.whatsappNumber, message);
  };

  const getLineBadgeInfo = (segment?: Product["segment"]) => {
    if (segment === "corporativo") {
      return {
        label: "Corporativo",
        pillClass: "bg-[#3A2439] text-[#FFC947]",
        stripClass: "bg-gradient-to-r from-[#FFC947] via-[#3A2439] to-[#FFC947]",
      };
    }
    if (segment === "ambos") {
      return {
        label: "Festa & Corporativo",
        pillClass: "bg-[#FFC947] text-[#3A2439]",
        stripClass: "bg-gradient-to-r from-[#E8527A] via-[#FFC947] to-[#3A2439]",
      };
    }
    return {
      label: "Festa",
      pillClass: "bg-[#E8527A] text-white",
      stripClass: "bg-gradient-to-r from-[#E8527A] via-[#FFC947] to-[#E8527A]",
    };
  };

  const sectionHeading =
    activeSegment === "pessoal"
      ? "Catálogo: Kit de Festas Pessoais em Brasília - DF"
      : activeSegment === "corporativo"
      ? "Catálogo: Lembrancinhas Corporativas em Brasília - DF"
      : "Catálogo de Produtos em Brasília - DF";

  const sectionDescription =
    activeSegment === "pessoal"
      ? "Lembrancinhas afetivas, caixas personalizadas, topos de bolo e kits festa para aniversários, casamentos e celebrações em Brasília - DF e entorno."
      : activeSegment === "corporativo"
      ? "Brindes corporativos, tubolatas, blocos de notas e embalagens personalizadas com a sua marca para empresas e eventos em Brasília - DF e todo o Distrito Federal."
      : "Explore o catálogo oficial da DL Magic Paper com preços atualizados diretamente pelo ateliê em Brasília - DF. Atendimento para festas pessoais, casamentos e empresas no Distrito Federal.";

  return (
    <section
      id="produtos"
      aria-labelledby="heading-produtos"
      className="py-16 sm:py-24 bg-[#FFF6F0] relative z-10 border-t border-[#3A2439]/5"
    >
      <span id="catalogo" className="sr-only" aria-hidden="true" />
      {/* Decorative Glow Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#FFC947]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8527A]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E8527A]" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#E8527A]">
              Vitrine Oficial DL Magic Paper • Brasília - DF
            </span>
          </div>

          <h2
            id="heading-produtos"
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3A2439] tracking-tight leading-tight"
          >
            {sectionHeading}
          </h2>

          <p className="font-sans text-[#3A2439]/75 leading-relaxed font-normal text-sm sm:text-base max-w-2xl mx-auto">
            {sectionDescription}
          </p>
        </div>

        {/* 3 VITRINE LINE TABS */}
        <div className="max-w-4xl mx-auto mb-8" id="catalog_segment_switcher_bar">
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-[2rem] border-2 border-[#3A2439]/10 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Aba 1: Todos os Produtos */}
            <button
              type="button"
              onClick={() => handleSwitchSegment("todos")}
              className={`py-3 px-4 rounded-[1.5rem] font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeSegment === "todos"
                  ? "bg-gradient-to-r from-[#E8527A] to-[#D43C65] text-white shadow-md shadow-[#E8527A]/25"
                  : "bg-transparent text-[#3A2439]/75 hover:bg-[#FFF6F0] hover:text-[#E8527A]"
              }`}
              id="tab_switch_todos"
            >
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span>Todos os Produtos</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeSegment === "todos"
                    ? "bg-white/25 text-white"
                    : "bg-[#FFF6F0] text-[#3A2439]/60"
                }`}
              >
                {counts.todos}
              </span>
            </button>

            {/* Aba 2: Linha Pessoal & Festas */}
            <button
              type="button"
              onClick={() => handleSwitchSegment("pessoal")}
              className={`py-3 px-4 rounded-[1.5rem] font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeSegment === "pessoal"
                  ? "bg-[#E8527A] text-white shadow-md shadow-[#E8527A]/25"
                  : "bg-transparent text-[#3A2439]/75 hover:bg-[#FFF6F0] hover:text-[#E8527A]"
              }`}
              id="tab_switch_pessoal"
            >
              <PartyPopper className="w-4 h-4 shrink-0" />
              <span>Linha Pessoal &amp; Festas</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeSegment === "pessoal"
                    ? "bg-white/25 text-white"
                    : "bg-[#FFF6F0] text-[#3A2439]/60"
                }`}
              >
                {counts.pessoal}
              </span>
            </button>

            {/* Aba 3: Linha Corporativa */}
            <button
              type="button"
              onClick={() => handleSwitchSegment("corporativo")}
              className={`py-3 px-4 rounded-[1.5rem] font-sans text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeSegment === "corporativo"
                  ? "bg-[#3A2439] text-white shadow-md shadow-[#3A2439]/25"
                  : "bg-transparent text-[#3A2439]/75 hover:bg-[#FFF6F0] hover:text-[#3A2439]"
              }`}
              id="tab_switch_corporativo"
            >
              <Briefcase
                className={`w-4 h-4 shrink-0 ${
                  activeSegment === "corporativo" ? "text-[#FFC947]" : "text-[#3A2439]"
                }`}
              />
              <span>Linha Corporativa</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeSegment === "corporativo"
                    ? "bg-[#FFC947] text-[#3A2439]"
                    : "bg-[#FFF6F0] text-[#3A2439]/60"
                }`}
              >
                {counts.corporativo}
              </span>
            </button>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="max-w-md mx-auto relative mb-10" id="catalog_search_box">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3A2439]/40 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            maxLength={80}
            placeholder={
              activeSegment === "corporativo"
                ? "Buscar brindes, blocos, sacolas..."
                : "Buscar sacolinhas, kits, caixas, topos..."
            }
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

        {/* LOADING STATE (Skeleton Cards + Spinner) */}
        {loading && (
          <div className="space-y-8" id="catalog_loading_state">
            <div className="flex items-center justify-center gap-2.5 text-sm font-sans font-semibold text-[#3A2439]/75">
              <Loader2 className="w-4 h-4 text-[#E8527A] animate-spin" />
              <span>Buscando produtos e preços atualizados...</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[1.75rem] border border-[#3A2439]/10 shadow-sm overflow-hidden animate-pulse flex flex-col justify-between"
                >
                  <div className="h-2.5 w-full bg-[#E8527A]/20" />
                  <div className="p-5 space-y-4">
                    <div className="aspect-square rounded-2xl bg-[#FFF6F0] border border-[#3A2439]/5 flex items-center justify-center">
                      <Gift className="w-10 h-10 text-[#E8527A]/20" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-slate-200 rounded-full" />
                      <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
                      <div className="h-3 w-full bg-slate-100 rounded-md" />
                      <div className="h-3 w-2/3 bg-slate-100 rounded-md" />
                    </div>
                    <div className="pt-3 border-t border-dashed border-[#3A2439]/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="h-3 w-16 bg-slate-100 rounded-full" />
                        <div className="h-6 w-24 bg-[#FFC947]/30 rounded-lg" />
                      </div>
                      <div className="h-10 w-full bg-[#E8527A]/25 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && (
          <>
            {filteredProducts.length > 0 ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto px-1 mb-5 text-xs text-[#3A2439]/70">
                  <div>
                    Exibindo{" "}
                    <strong className="text-[#3A2439] font-bold">
                      {filteredProducts.length}
                    </strong>{" "}
                    {filteredProducts.length === 1 ? "produto" : "produtos"}
                    {activeSegment === "pessoal"
                      ? " na Linha Pessoal & Festas"
                      : activeSegment === "corporativo"
                      ? " na Linha Corporativa"
                      : " no catálogo"}
                  </div>
                  {activeSegment !== "todos" && (
                    <button
                      type="button"
                      onClick={() => handleSwitchSegment("todos")}
                      className="text-xs font-bold text-[#E8527A] hover:underline cursor-pointer"
                    >
                      Ver todos os produtos
                    </button>
                  )}
                </div>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7"
                  id="catalog_products_grid"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product) => {
                      const badgeInfo = getLineBadgeInfo(product.segment);
                      const finalPrice = product.precoVenda ?? product.minPrice ?? 0;
                      const safeImageUrl = isSafeImageSource(product.image, false);
                      const hasValidImage =
                        Boolean(safeImageUrl) && !brokenImages[product.id];
                      const safeName = sanitizePlainText(
                        product.name,
                        MAX_PRODUCT_NAME_LENGTH,
                        "Produto Personalizado"
                      );
                      const safeDescription = sanitizePlainText(
                        product.description,
                        MAX_PRODUCT_DESCRIPTION_LENGTH
                      );
                      const whatsappUrl = buildWhatsAppOrderUrl(product);

                      return (
                        <motion.article
                          key={product.id}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.22 }}
                          onClick={() => onSelectProduct(product)}
                          className="bg-white rounded-[1.75rem] border border-[#3A2439]/10 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative cursor-pointer group overflow-hidden"
                          id={`product_card_${product.id}`}
                        >
                          {/* Top Colorful Strip */}
                          <div className={`h-2.5 w-full ${badgeInfo.stripClass}`} />

                          {/* Card Body */}
                          <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                            <div className="space-y-4">
                              {/* Photo or Elegant Stationery Placeholder */}
                              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF6F0] via-white to-[#FCEBF1] border border-[#3A2439]/8 shadow-inner flex items-center justify-center">
                                {/* Tag da Linha (Festa / Corporativo) */}
                                <span
                                  className={`absolute top-3 left-3 z-10 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${badgeInfo.pillClass}`}
                                >
                                  {badgeInfo.label}
                                </span>

                                {hasValidImage ? (
                                  <img
                                    src={safeImageUrl}
                                    alt={safeName}
                                    loading="lazy"
                                    onError={() =>
                                      setBrokenImages((prev) => ({
                                        ...prev,
                                        [product.id]: true,
                                      }))
                                    }
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-2.5">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E8527A]/15 flex items-center justify-center text-[#E8527A] group-hover:scale-110 transition-transform duration-300">
                                      {product.segment === "corporativo" ? (
                                        <Briefcase className="w-8 h-8 text-[#3A2439]" />
                                      ) : (
                                        <Gift className="w-8 h-8 text-[#E8527A]" />
                                      )}
                                    </div>
                                    <span className="font-serif text-xs font-bold text-[#3A2439]/60">
                                      DL Magic Paper
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="text-left space-y-1.5">
                                <h3 className="font-serif text-lg font-bold text-[#3A2439] tracking-tight leading-snug group-hover:text-[#E8527A] transition-colors line-clamp-2 break-words">
                                  {safeName}
                                </h3>

                                <p className="font-sans text-xs text-[#3A2439]/70 line-clamp-2 leading-relaxed break-words">
                                  {safeDescription}
                                </p>
                              </div>
                            </div>

                            {/* Preço Final & Botão Encomendar no WhatsApp */}
                            <div className="mt-5 pt-3.5 border-t border-dashed border-[#3A2439]/12 space-y-3">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="font-sans text-xs text-[#3A2439]/60 font-medium">
                                  Valor:
                                </span>
                                <span className="font-sans font-extrabold text-xl text-[#3A2439] tabular-nums">
                                  {formatPriceBRL(finalPrice)}
                                </span>
                              </div>

                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 font-sans font-bold text-xs tracking-wide text-white rounded-full shadow-sm transition-all cursor-pointer bg-[#25D366] hover:bg-[#1EBE5D] shadow-[#25D366]/20 hover:scale-[1.01]"
                              >
                                <MessageCircle className="w-4 h-4 shrink-0" />
                                <span>Encomendar no WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </>
            ) : errorMessage ? (
              /* CLEAR ERROR STATE WITH DISCREET DIAGNOSTIC */
              <div
                className="py-12 sm:py-14 text-center space-y-4 bg-white rounded-3xl border border-rose-200 p-8 max-w-xl mx-auto shadow-sm"
                id="catalog_error_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500">
                  <AlertCircle className="w-8 h-8" />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2439]">
                  {permissionError
                    ? "Permissão pendente no banco de produtos"
                    : "Não foi possível carregar o catálogo agora"}
                </h3>

                <p className="text-xs sm:text-sm font-sans text-[#3A2439]/75 leading-relaxed max-w-md mx-auto">
                  {permissionError
                    ? "O Firestore do projeto dl-sistema-6eee9 bloqueou a leitura pública da coleção produtos. Verifique as regras de leitura ou fale com nossa equipe no WhatsApp."
                    : "Houve uma instabilidade ou pendência de configuração ao consultar o Firebase. Tente atualizar ou faça seu orçamento direto pelo WhatsApp."}
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[11px] font-mono text-slate-500 break-words max-w-md mx-auto">
                  Diagnóstico: {sanitizePlainText(errorMessage, 180)}
                </div>

                {rateLimited && (
                  <p className="text-[11px] font-sans text-amber-700 font-semibold">
                    Aguarde alguns segundos antes de tentar atualizar novamente.
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={refreshProducts}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3A2439] hover:bg-[#5E3D5C] text-white text-xs font-bold font-sans shadow-xs cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tentar novamente</span>
                  </button>

                  <a
                    href={buildSafeWhatsAppUrl(
                      data.whatsappNumber,
                      "Olá! Vim pelo site da DL Magic Paper e gostaria de solicitar um orçamento personalizado."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold font-sans shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Falar no WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              /* FRIENDLY EMPTY STATE */
              <div
                className="py-14 sm:py-16 text-center space-y-4 bg-white rounded-3xl border border-[#3A2439]/10 p-8 max-w-xl mx-auto shadow-sm"
                id="catalog_empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#FFF6F0] border border-[#E8527A]/15 flex items-center justify-center mx-auto text-[#E8527A]">
                  <Gift className="w-8 h-8" />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#3A2439]">
                  {searchTerm
                    ? "Nenhum produto encontrado para essa busca"
                    : activeSegment === "pessoal"
                    ? "Nenhum item na Linha Pessoal & Festas ainda"
                    : activeSegment === "corporativo"
                    ? "Nenhum item na Linha Corporativa ainda"
                    : "Catálogo sendo atualizado pelo ateliê"}
                </h3>

                <p className="text-xs sm:text-sm font-sans text-[#3A2439]/70 leading-relaxed max-w-md mx-auto">
                  {searchTerm
                    ? "Tente buscar com outro nome ou limpe a busca para visualizar os produtos disponíveis."
                    : "Ainda estamos cadastrando novidades nesta categoria. Se quiser um item sob medida, fale direto com a nossa equipe no WhatsApp!"}
                </p>

                {rateLimited && (
                  <p className="text-[11px] font-sans text-amber-700 font-semibold">
                    Atualização em intervalo de segurança. Aguarde alguns segundos antes de consultar novamente.
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {searchTerm ? (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="px-5 py-2.5 rounded-full bg-[#E8527A] text-white text-xs font-bold font-sans shadow-xs cursor-pointer hover:bg-[#D43C65]"
                    >
                      Limpar Busca
                    </button>
                  ) : (
                    <>
                      {activeSegment !== "todos" && (
                        <button
                          type="button"
                          onClick={() => handleSwitchSegment("todos")}
                          className="px-5 py-2.5 rounded-full bg-[#3A2439] text-white text-xs font-bold font-sans shadow-xs cursor-pointer hover:bg-[#5E3D5C]"
                        >
                          Ver Todos os Produtos
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={refreshProducts}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FFF6F0] border border-[#3A2439]/15 text-[#3A2439] text-xs font-bold font-sans cursor-pointer hover:border-[#E8527A]"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Atualizar vitrine</span>
                      </button>
                    </>
                  )}

                  <a
                    href={buildSafeWhatsAppUrl(
                      data.whatsappNumber,
                      "Olá! Vim pelo site da DL Magic Paper e gostaria de solicitar um orçamento personalizado."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold font-sans shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Falar no WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
