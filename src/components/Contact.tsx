import React, { useState } from "react";
import { motion } from "motion/react";
import { Instagram, MapPin, Send, MessageCircle, AlertCircle, Sparkles, Calendar, Heart, ShieldCheck } from "lucide-react";
import { useAppContext } from "../context/DataContext";

export default function Contact() {
  const { data } = useAppContext();
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    dataCelebracao: "",
    temaInteresse: "",
    categoriaInteresse: "Kits Festa",
    observações: ""
  });
  
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.whatsapp) {
      alert("Por favor, preencha o seu nome e WhatsApp!");
      return;
    }

    // Format WhatsApp Message beautifully
    const textMessage = `Olá DL Magic Paper! Gostaria de falar sobre um personalizado para minha festa ✨
    
👤 *Nome:* ${formData.nome}
📱 *WhatsApp:* ${formData.whatsapp}
📅 *Data da Celebração:* ${formData.dataCelebracao || "Não informada"}
🎨 *Tema de Interesse:* ${formData.temaInteresse || "A decidir"}
🛍️ *Categoria:* ${formData.categoriaInteresse}
✍️ *Detalhes:* ${formData.observações || "Nenhum adicional"}
    
_Enviado através do site catálogo DL Magic Paper._`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappLink = `https://wa.me/${data.whatsappNumber}?text=${encodedText}`;

    // Update state to show success
    setIsSent(true);
    
    // Redirect organically
    setTimeout(() => {
      window.location.href = whatsappLink;
      setIsSent(false);
    }, 1200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contato" className="py-20 lg:py-28 bg-slate-50 relative">
      
      <div className="absolute top-1/4 right-10 w-44 h-44 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-44 h-44 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-[#21C2C0] bg-cyan-50 px-4 py-1.5 rounded-full border border-cyan-100">
            Fale Conosco 💬
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight">
            Solicite Agora o Seu Orçamento
          </h2>
          <p className="font-sans text-slate-500 leading-relaxed font-light text-base sm:text-lg">
            Estamos ansiosas para fazer parte do seu momento especial! Preencha o formulário abaixo para enviar os detalhes ou entre em contato diretamente pelo nosso WhatsApp oficial.
          </p>
        </div>

        {/* Outer Split Row Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-stretch" id="contact_split_grid">
          
          {/* Left Block - Elegant Form */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-12 shadow-xl shadow-slate-100/40 text-left">
            
            <h3 className="font-serif text-2xl font-bold text-slate-800 mb-6 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-pink fill-brand-pink/20" />
              Enviar Nova Mensagem
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Nome Completo */}
                <div className="space-y-1.5">
                  <label htmlFor="nome" className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                    Seu nome *
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Amanda Santos"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-pink/15 focus:border-brand-pink transition-all text-sm font-medium"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label htmlFor="whatsapp" className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    required
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="Ex: (61) 99888-9577"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-pink/15 focus:border-brand-pink transition-all text-sm font-medium"
                  />
                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Data de Execução do Evento */}
                <div className="space-y-1.5">
                  <label htmlFor="dataCelebracao" className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                    Data da Celebração
                  </label>
                  <input
                    type="date"
                    id="dataCelebracao"
                    name="dataCelebracao"
                    value={formData.dataCelebracao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-pink/15 focus:border-brand-pink transition-all text-sm font-medium"
                  />
                </div>

                {/* Categoria Recomendada */}
                <div className="space-y-1.5">
                  <label htmlFor="categoriaInteresse" className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                    Você busca principalmente por:
                  </label>
                  <select
                    id="categoriaInteresse"
                    name="categoriaInteresse"
                    value={formData.categoriaInteresse}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-brand-pink/15 focus:border-brand-pink transition-all text-sm font-medium"
                  >
                    <option value="Topos de Bolo">Topos de Bolo</option>
                    <option value="Caixas Personalizadas">Caixas Personalizadas</option>
                    <option value="Tubolatas">Tubolatas</option>
                    <option value="Adesivos">Adesivos</option>
                    <option value="Kits Festa">Kits Festa Completos</option>
                  </select>
                </div>

              </div>

              {/* Tema de Interesse */}
              <div className="space-y-1.5">
                <label htmlFor="temaInteresse" className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                  Qual o tema desejado da festa?
                </label>
                <input
                  type="text"
                  id="temaInteresse"
                  name="temaInteresse"
                  value={formData.temaInteresse}
                  onChange={handleInputChange}
                  placeholder="Ex: Stitch Rosa, Safari do Baby, Realeza..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-pink/15 focus:border-brand-pink transition-all text-sm font-medium"
                />
              </div>

              {/* Observações / Descrição detalhada */}
              <div className="space-y-1.5">
                <label htmlFor="observações" className="block text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
                  Idade do aniversariante ou outros detalhes especiais
                </label>
                <textarea
                  id="observações"
                  name="observações"
                  rows={3}
                  value={formData.observações}
                  onChange={handleInputChange}
                  placeholder="Escreva aqui se deseja incluir o nome da criança, as cores de preferência ou alguma combinação de caixinhas..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-pink/15 focus:border-brand-pink transition-all text-sm font-medium resize-none"
                />
              </div>

              {/* Form submit with dynamic loading state */}
              <button
                type="submit"
                disabled={isSent}
                className={`w-full flex items-center justify-center gap-2 text-white font-bold py-4 px-6 rounded-2xl transition-all cursor-pointer shadow-md ${
                  isSent
                    ? "bg-emerald-500 shadow-emerald-200"
                    : "bg-gradient-to-r from-brand-pink to-brand-pink-hover shadow-pink-100"
                }`}
                id="contact_form_submit"
              >
                {isSent ? (
                  <>
                    <ShieldCheck className="w-5 h-5 animate-bounce" />
                    Abrindo Conversa no WhatsApp...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 fill-white/10" />
                    Enviar e Redirecionar ao WhatsApp
                  </>
                )}
              </button>

              <div className="flex items-start gap-2 text-slate-400 text-xs mt-3 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 text-slate-300" />
                <span>
                  Trabalhamos com preenchimento humanizado. Você receberá uma cópia do seu texto e começará a falar diretamente com a DL Magic Paper no celular em instantes.
                </span>
              </div>

            </form>

          </div>

          {/* Right Block - Illustrated Map & Contact Information */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            
            {/* Contact Details Board */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-lg shadow-slate-100/40 text-left space-y-6">
              
              <h3 className="font-serif text-xl font-bold text-slate-800 tracking-tight">
                Informações de Contato
              </h3>

              <div className="space-y-5 font-sans">
                
                {/* Whatsapp details click */}
                <a
                  href={`https://wa.me/${data.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100 transition-all group"
                  id="direct_whatsapp_link_card"
                >
                  <div className="p-3 bg-emerald-100 group-hover:bg-emerald-500 group-hover:text-white rounded-xl text-emerald-600 transition-colors shrink-0">
                    <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 leading-tight">WhatsApp do Ateliê</h4>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">{data.whatsappFormatted}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold underline block mt-0.5">Falar agora de Brasília</span>
                  </div>
                </a>

                {/* Instagram details click */}
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-pink-50/50 border border-transparent hover:border-pink-100 transition-all group"
                  id="direct_instagram_link_card"
                >
                  <div className="p-3 bg-pink-100 group-hover:bg-brand-pink group-hover:text-white rounded-xl text-brand-pink transition-colors shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 leading-tight">Instagram Oficial</h4>
                    <p className="text-base font-extrabold text-slate-700 mt-0.5">{data.instagramHandle}</p>
                    <span className="text-[10px] text-brand-pink font-semibold underline block mt-0.5">Seguir nossa rotina</span>
                  </div>
                </a>

                {/* Physical and regional detail */}
                <div className="flex items-start gap-4 p-3 rounded-2xl border border-transparent text-slate-600">
                  <div className="p-3 bg-cyan-100 text-[#21C2C0] rounded-xl shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 leading-tight">Localização</h4>
                    <p className="text-sm font-extrabold text-slate-700 mt-0.5">Brasília, Distrito Federal</p>
                    <p className="text-[11px] text-slate-400 leading-normal font-light mt-0.5">A retirada é programada ou enviamos para todo o DF por motoboy / postagem nacional.</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Illustrated Brasília Map - Exquisite HTML rendering with high-end style */}
            <div className="bg-gradient-to-br from-brand-pastel-bg to-pink-50 border border-pink-100 rounded-[2.5rem] p-6 shadow-md shadow-slate-100 text-left relative overflow-hidden flex-1 flex flex-col justify-between min-h-[250px]" id="brasilia_illustrated_map">
              
              {/* Background Map Contours represented by SVG circular grid lines */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
                <svg width="100%" height="100%">
                  <circle cx="50%" cy="50%" r="50" fill="none" stroke="#FF6699" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx="50%" cy="50%" r="100" fill="none" stroke="#FF6699" strokeWidth="1" strokeDasharray="4,4" />
                  <circle cx="50%" cy="50%" r="140" fill="none" stroke="#20C0C0" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#FFB9D2" strokeWidth="0.5" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#FFB9D2" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Header inside map */}
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-slate-700 text-sm">Mapa Ilustrativo DF</h4>
                  <p className="font-sans text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Atendimento em toda Brasília</p>
                </div>
                <span className="bg-white/80 backdrop-blur-xs text-[9px] font-bold text-brand-pink px-2.5 py-1 rounded-full shadow-xs border border-pink-100">
                  Planaltina • DF
                </span>
              </div>

              {/* Simulated Map Visual Center with pulsing pins */}
              <div className="relative z-10 my-6 h-36 flex items-center justify-center pointer-events-none">
                
                {/* Central Ateliê Marker */}
                <div className="relative flex flex-col items-center">
                  <span className="absolute animate-ping inline-flex h-8 w-8 rounded-full bg-brand-pink opacity-25" />
                  <div className="w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center shadow-lg relative border-2 border-white">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <span className="text-[10px] font-extrabold text-brand-pink bg-white px-2 py-0.5 rounded-md shadow-md border border-pink-100/50 mt-1">
                    Ateliê DL Magic Paper (Brasília)
                  </span>
                </div>

                {/* Secondary indicators pointers on map */}
                <div className="absolute top-2 left-6 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-brand-tiffany animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-500 bg-white/70 px-1.5 py-0.5 rounded-sm">Sobradinho</span>
                </div>

                <div className="absolute bottom-2 left-12 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#B896F5] animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-500 bg-white/70 px-1.5 py-0.5 rounded-sm">Águas Claras</span>
                </div>

                <div className="absolute top-4 right-10 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-[9px] font-bold text-slate-500 bg-white/70 px-1.5 py-0.5 rounded-sm">Asa Norte / Sul</span>
                </div>

              </div>

              {/* Delivery and Ship footer */}
              <div className="relative z-10 pt-2 border-t border-pink-100/50 flex justify-between items-center text-[11px] text-slate-500 font-sans">
                <span className="flex items-center gap-1 leading-none shrink-0 font-light">
                  🛵 Entrega Rápida por Motoboy
                </span>
                <span className="flex items-center gap-1 leading-none shrink-0 font-light">
                  ✈️ Sedex Nacional
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
