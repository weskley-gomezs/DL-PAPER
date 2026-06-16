import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, ShoppingBag, X, Trash2, Plus, Minus, Send, Heart, Sparkles, AlertCircle } from "lucide-react";
import { BudgetItem } from "../types";
import { useAppContext } from "../context/DataContext";

interface BudgetFloatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  budgetItems: BudgetItem[];
  onRemoveItem: (index: number) => void;
  onUpdateQuantity: (index: number, quantity: number) => void;
}

export default function BudgetFloat({
  isOpen,
  onClose,
  onOpen,
  budgetItems,
  onRemoveItem,
  onUpdateQuantity,
}: BudgetFloatProps) {
  const { data } = useAppContext();
  
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [overallTheme, setOverallTheme] = useState("");

  // Calculate totals
  const totalMin = budgetItems.reduce((acc, item) => acc + item.product.minPrice * item.quantity, 0);
  const totalMax = budgetItems.reduce((acc, item) => acc + item.product.maxPrice * item.quantity, 0);

  const handleSendWhatsAppBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (budgetItems.length === 0) return;
    if (!clientName) {
      alert("Por favor, preencha seu nome para personalizar o orçamento!");
      return;
    }

    // Format WhatsApp Budget message beautifully
    let listText = "";
    budgetItems.forEach((item, index) => {
      const p = item.product;
      const minCost = p.minPrice * item.quantity;
      const maxCost = p.maxPrice * item.quantity;
      listText += `• *${item.quantity}x* ${p.name}\n`;
      if (p.minPrice === p.maxPrice) {
        listText += `  _Preço:_ R$ ${minCost.toFixed(2).replace(".", ",")}\n`;
      } else {
        listText += `  _Preço est.:_ R$ ${minCost.toFixed(2).replace(".", ",")} a R$ ${maxCost.toFixed(2).replace(".", ",")}\n`;
      }
      if (item.theme) listText += `  _Tema:_ ${item.theme}\n`;
      if (item.notes) listText += `  _Obs:_ ${item.notes}\n\n`;
    });

    const finalMessage = `🌟 *NOVA SIMULAÇÃO DE ORÇAMENTO - DL MAGIC PAPER* 🌟
    
Olá DL Magic Paper! Acabei de simular meu orçamento de papelaria personalizada no site:

👤 *Cliente:* ${clientName}
📅 *Data da Celebração:* ${eventDate || "Não informada"}
🎨 *Tema Principal:* ${overallTheme || "A decidir"}

---
*Itens no Carrinho:*
${listText}
---
💰 *Valor Total do Pedido:* *R$ ${totalMin.toFixed(2).replace(".", ",")}*
_(O valor oficial será enviado após combinarmos a arte de cada item)_

Gostaria de confirmar a disponibilidade para esta data e fechar meu pedido!`;

    const encodedMsg = encodeURIComponent(finalMessage);
    const whatsappLink = `https://wa.me/${data.whatsappNumber}?text=${encodedMsg}`;
    
    // Redirect cleanly
    window.location.href = whatsappLink;
  };

  return (
    <>
      {/* Floating Indicators & Trigger Handles at bottom right */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Active Shopping Budget Handle - floats when there are items */}
        {budgetItems.length > 0 && (
          <motion.button
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 30 }}
            onClick={onOpen}
            className="pointer-events-auto flex items-center gap-2 bg-slate-900 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl hover:bg-brand-pink hover:scale-105 hover:shadow-pink-500/25 transition-all text-sm font-bold border border-slate-800"
            title="Ver orçamento simulado"
            id="floating_cart_handle"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="absolute -top-2.5 -right-2 bg-brand-pink text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-slate-900">
                {budgetItems.length}
              </span>
            </div>
            <span>Meu Orçamento</span>
          </motion.button>
        )}

        {/* Pulse Support WhatsApp Anchor */}
        <a
          href={`https://wa.me/${data.whatsappNumber}?text=Ol%C3%A1%20DL%20Magic%20Paper!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20as%20lembrancinhas%20personalizadas.`}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto relative flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-full shadow-2xl hover:bg-emerald-600 hover:scale-[1.08] transition-all group"
          title={`Falar com DL Magic Paper no WhatsApp`}
          id="floating_whatsapp_support"
        >
          {/* Radial Ring Glow */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/40 animate-ping pointer-events-none" />
          <MessageCircle className="w-7 h-7 stroke-[2.2] fill-white/10" />
          
          {/* Support Tooltip on hover */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none">
            Dúvidas? Fale Conosco! 😊
          </span>
        </a>

      </div>

      {/* Slide-In Sidebar Budget Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Dim overlay panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
              id="sidebar_backdrop_overlay"
            />

            {/* Sidebar Canvas Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-55 w-full sm:max-w-md bg-white shadow-2xl p-6 sm:p-8 flex flex-col justify-between pointer-events-auto overflow-y-auto"
              id="budget_sidebar_drawer"
            >
              
              {/* Header section with Close Trigger */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-pink-50 rounded-xl text-brand-pink">
                      <ShoppingBag className="w-5 h-5 text-brand-pink" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-serif font-extrabold text-slate-800 text-lg leading-tight">
                        Orçamento Mágico
                      </h3>
                      <p className="font-sans text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                        DL Magic Paper
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                    id="sidebar_close_btn"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Items List container */}
                {budgetItems.length === 0 ? (
                  
                  // Empty State inside Sidebar
                  <div className="py-16 text-center space-y-4">
                    <p className="text-4xl">✨</p>
                    <h4 className="font-serif font-extrabold text-slate-700 text-base">Seu carrinho está vazio!</h4>
                    <p className="text-xs text-slate-400 font-sans max-w-[220px] mx-auto leading-relaxed">
                      Visite nosso catálogo e adicione os itens com os seus temas preferidos para calcular o orçamento.
                    </p>
                    <button
                      onClick={onClose}
                      className="text-xs font-bold font-sans text-brand-pink bg-pink-50 px-4 py-2 rounded-full hover:bg-pink-100"
                    >
                      Ver Catálogo de Produtos
                    </button>
                  </div>
                ) : (
                  
                  // Active Items State inside Sidebar
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {budgetItems.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${idx}`}
                        className="flex gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-left relative group hover:bg-slate-50 transition-colors"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 space-y-1">
                          <h4 className="font-serif text-sm font-extrabold text-slate-800 leading-tight">
                            {item.product.name}
                          </h4>
                          
                          {/* Mini Details info */}
                          <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-medium font-sans">
                            <div className="flex flex-wrap gap-x-2">
                              {item.theme && <span>🎨 Tema: {item.theme}</span>}
                              {item.notes && <span>✍️ Obs: {item.notes}</span>}
                            </div>
                            
                            {/* Validation warning */}
                            {item.product.category === "Lembrancinhas" && item.quantity < 10 && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md w-fit">
                                <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                                Pedido mínimo de 10 unidades deste item
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1.5">
                            
                            {/* Quantity buttons within cart */}
                            <div className="flex items-center scale-90 -ml-1 border border-slate-200 bg-white rounded-full p-0.5">
                              <button
                                onClick={() => onUpdateQuantity(idx, Math.max(1, item.quantity - 1))}
                                className="p-0.5 rounded-full text-slate-400 hover:text-slate-700 transition"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-5 text-center text-[11px] font-bold text-slate-700 select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                                className="p-0.5 rounded-full text-slate-400 hover:text-slate-700 transition"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Cost estimate for quantity */}
                            <span className="text-[11px] font-extrabold text-slate-600 font-sans">
                              {item.product.minPrice === item.product.maxPrice ? (
                                `R$ ${(item.product.minPrice * item.quantity).toFixed(2).replace(".", ",")}`
                              ) : (
                                `R$ ${(item.product.minPrice * item.quantity).toFixed(2).replace(".", ",")} - ${(item.product.maxPrice * item.quantity).toFixed(2).replace(".", ",")}`
                              )}
                            </span>

                          </div>

                        </div>

                        {/* Direct Delete item button */}
                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="absolute top-2 right-2 p-1 rounded-full text-red-300 hover:text-red-500 hover:bg-red-50 transition"
                          title="Remover Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom calculations & WhatsApp push form */}
              {budgetItems.length > 0 && (
                <div className="border-t border-slate-100 pt-6 space-y-5">
                  
                  {/* Estimativa Subtotal Display */}
                  <div className="bg-brand-pastel-bg border border-pink-100/60 rounded-2xl p-4 text-left">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-sans text-xs tracking-wide text-slate-400 font-bold uppercase">Subtotal:</span>
                      <span className="font-serif font-extrabold text-xl text-brand-pink">
                        {totalMin === totalMax ? (
                          `R$ ${totalMin.toFixed(2).replace(".", ",")}`
                        ) : (
                          <>
                            R$ {totalMin.toFixed(2).replace(".", ",")} <span className="text-slate-400 text-xs font-normal font-sans">a</span> R$ {totalMax.toFixed(2).replace(".", ",")}
                          </>
                        )}
                      </span>
                    </div>
                    <p className="font-sans text-[10px] text-slate-400 leading-normal font-light">
                      *Estimativa base do ateliê. Os valores finais podem variar conforme os detalhes específicos da arte, acrílico espelhado ou apliques exclusivos solicitados.
                    </p>
                  </div>

                  {/* Identification and Theme choices to compile WhatsApp message */}
                  <form onSubmit={handleSendWhatsAppBudget} className="space-y-3">
                    
                    <div className="space-y-1 text-left">
                      <label htmlFor="clientName" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                        Seu nome completo *
                      </label>
                      <input
                        type="text"
                        id="clientName"
                        required
                        placeholder="Amanda Santos"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-brand-pink focus:bg-white transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="space-y-1">
                        <label htmlFor="eventDate" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                          Data da Festa
                        </label>
                        <input
                          type="date"
                          id="eventDate"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs text-slate-700 focus:outline-hidden focus:border-brand-pink focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="overallTheme" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">
                          Tema Principal
                        </label>
                        <input
                          type="text"
                          id="overallTheme"
                          placeholder="Ex: Stitch Rosa"
                          value={overallTheme}
                          onChange={(e) => setOverallTheme(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-sans text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-brand-pink"
                        />
                      </div>
                    </div>

                    {/* Submit Button Trigger WhatsApp */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-emerald-100 font-sans text-xs sm:text-sm cursor-pointer mt-2"
                      id="sidebar_send_whatsapp_button"
                    >
                      <Send className="w-4 h-4 fill-white/10" />
                      Enviar Orçamento ao WhatsApp
                    </button>

                  </form>

                  {/* Instagram trust badge */}
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-semibold">
                    <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink/20" />
                    <span>DL Magic Paper • Ateliê Brasília</span>
                  </div>

                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
