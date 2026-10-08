import React, { useState } from "react";
import { motion } from "motion/react";
import { Instagram, MapPin, Send, MessageCircle, AlertCircle, Sparkles, Heart, ShieldCheck, Briefcase, PartyPopper } from "lucide-react";
import { useAppContext } from "../context/DataContext";

export default function Contact() {
  const { data } = useAppContext();
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    dataCelebracao: "",
    temaInteresse: "",
    categoriaInteresse: "Kits de Caixas",
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
    const textMessage = `Olá DL Magic Paper! Gostaria de solicitar um orçamento personalizado ✨
    
👤 *Nome:* ${formData.nome}
📱 *WhatsApp:* ${formData.whatsapp}
📅 *Data Desejada:* ${formData.dataCelebracao || "A combinar"}
🛍️ *Item de Interesse:* ${formData.categoriaInteresse}
🎨 *Tema / Cores:* ${formData.temaInteresse || "A definir"}
✍️ *Detalhes / Quantidade:* ${formData.observações || "Sob consulta"}
    
_Enviado através do site catálogo DL Magic Paper._`;

    const encodedText = encodeURIComponent(textMessage);
    const whatsappLink = `https://wa.me/${data.whatsappNumber}?text=${encodedText}`;

    setIsSent(true);
    
    setTimeout(() => {
      window.location.href = whatsappLink;
      setIsSent(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contato" className="py-20 lg:py-28 bg-[#FFF6F0] relative border-t border-[#3A2439]/5">
      
      <div className="absolute top-1/4 right-10 w-44 h-44 bg-[#FFC947]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-44 h-44 bg-[#E8527A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-[#E8527A]/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E8527A]" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#E8527A]">
              Fale com Nosso Ateliê 💬
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3A2439] tracking-tight">
            Solicite Agora o Seu Orçamento
          </h2>
          <p className="font-sans text-[#3A2439]/70 leading-relaxed font-normal text-sm sm:text-base">
            Estamos prontas para criar as peças perfeitas para a sua festa ou para os brindes da sua empresa! Preencha abaixo para falar direto no WhatsApp:
          </p>
        </div>

        {/* Outer Split Row Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-stretch" id="contact_split_grid">
          
          {/* Left Block - Elegant Form */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-[#3A2439]/10 p-6 sm:p-10 shadow-lg shadow-[#3A2439]/5 text-left flex flex-col justify-between">
            
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#3A2439] mb-6 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E8527A]" />
                Formulário Rápido de Orçamento
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  
                  {/* Nome Completo */}
                  <div className="space-y-1.5">
                    <label htmlFor="nome" className="block text-xs font-bold uppercase tracking-wider text-[#3A2439]/70 font-sans">
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
                      className="w-full px-4 py-3 bg-[#FFF6F0]/60 border border-[#3A2439]/15 rounded-xl font-sans text-[#3A2439] placeholder-[#3A2439]/40 focus:outline-hidden focus:ring-2 focus:ring-[#E8527A]/20 focus:border-[#E8527A] transition-all text-sm font-medium"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label htmlFor="whatsapp" className="block text-xs font-bold uppercase tracking-wider text-[#3A2439]/70 font-sans">
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
                      className="w-full px-4 py-3 bg-[#FFF6F0]/60 border border-[#3A2439]/15 rounded-xl font-sans text-[#3A2439] placeholder-[#3A2439]/40 focus:outline-hidden focus:ring-2 focus:ring-[#E8527A]/20 focus:border-[#E8527A] transition-all text-sm font-medium"
                    />
                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  
                  {/* Data do Evento / Entrega */}
                  <div className="space-y-1.5">
                    <label htmlFor="dataCelebracao" className="block text-xs font-bold uppercase tracking-wider text-[#3A2439]/70 font-sans">
                      Data da Celebração / Prazo
                    </label>
                    <input
                      type="date"
                      id="dataCelebracao"
                      name="dataCelebracao"
                      value={formData.dataCelebracao}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#FFF6F0]/60 border border-[#3A2439]/15 rounded-xl font-sans text-[#3A2439] focus:outline-hidden focus:ring-2 focus:ring-[#E8527A]/20 focus:border-[#E8527A] transition-all text-sm font-medium"
                    />
                  </div>

                  {/* Categoria */}
                  <div className="space-y-1.5">
                    <label htmlFor="categoriaInteresse" className="block text-xs font-bold uppercase tracking-wider text-[#3A2439]/70 font-sans">
                      Principal interesse:
                    </label>
                    <select
                      id="categoriaInteresse"
                      name="categoriaInteresse"
                      value={formData.categoriaInteresse}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#FFF6F0]/60 border border-[#3A2439]/15 rounded-xl font-sans text-[#3A2439] focus:outline-hidden focus:ring-2 focus:ring-[#E8527A]/20 focus:border-[#E8527A] transition-all text-sm font-medium"
                    >
                      <option value="Kits de Caixas">Kits de Caixas Clássicas</option>
                      <option value="Caixas Avulsas">Caixas Avulsas (Milk, Bala, Pirâmide...)</option>
                      <option value="Tubolatas">Tubolatas Personalizadas</option>
                      <option value="Adesivos & Rótulos">Adesivos & Rótulos com Logo</option>
                      <option value="Sacolas com Laço">Sacolinhas com Fita de Cetim</option>
                      <option value="Topos de Bolo">Topos de Bolo 3D</option>
                      <option value="Brindes Corporativos">Kit Brindes Corporativos</option>
                      <option value="Outros">Outros / Combinação Especial</option>
                    </select>
                  </div>

                </div>

                {/* Tema ou Cores Desejadas */}
                <div className="space-y-1.5">
                  <label htmlFor="temaInteresse" className="block text-xs font-bold uppercase tracking-wider text-[#3A2439]/70 font-sans">
                    Qual o tema ou cores desejadas?
                  </label>
                  <input
                    type="text"
                    id="temaInteresse"
                    name="temaInteresse"
                    value={formData.temaInteresse}
                    onChange={handleInputChange}
                    placeholder="Ex: Stitch Rosa, Safari, Princesas, Cores da Marca..."
                    className="w-full px-4 py-3 bg-[#FFF6F0]/60 border border-[#3A2439]/15 rounded-xl font-sans text-[#3A2439] placeholder-[#3A2439]/40 focus:outline-hidden focus:ring-2 focus:ring-[#E8527A]/20 focus:border-[#E8527A] transition-all text-sm font-medium"
                  />
                </div>

                {/* Observações */}
                <div className="space-y-1.5">
                  <label htmlFor="observações" className="block text-xs font-bold uppercase tracking-wider text-[#3A2439]/70 font-sans">
                    Quantidade aproximada ou detalhes adicionais
                  </label>
                  <textarea
                    id="observações"
                    name="observações"
                    rows={2}
                    value={formData.observações}
                    onChange={handleInputChange}
                    placeholder="Escreva aqui a quantidade que precisa, nome da pessoa ou dúvidas..."
                    className="w-full px-4 py-3 bg-[#FFF6F0]/60 border border-[#3A2439]/15 rounded-xl font-sans text-[#3A2439] placeholder-[#3A2439]/40 focus:outline-hidden focus:ring-2 focus:ring-[#E8527A]/20 focus:border-[#E8527A] transition-all text-sm font-medium resize-none"
                  />
                </div>

                {/* Submit Pill Button */}
                <button
                  type="submit"
                  disabled={isSent}
                  className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 px-6 rounded-full transition-all cursor-pointer shadow-md ${
                    isSent
                      ? "bg-emerald-600 shadow-emerald-200"
                      : "bg-[#E8527A] hover:bg-[#D43C65] shadow-[#E8527A]/20"
                  }`}
                  id="contact_form_submit"
                >
                  {isSent ? (
                    <>
                      <ShieldCheck className="w-5 h-5 animate-bounce" />
                      <span>Abrindo Conversa no WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      <span>Enviar e Falar no WhatsApp</span>
                    </>
                  )}
                </button>

              </form>
            </div>

            <div className="flex items-start gap-2 text-[#3A2439]/60 text-xs mt-4 pt-3 border-t border-[#3A2439]/10 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E8527A]" />
              <span>
                Atendimento humanizado de mãe para mãe. Você falará diretamente com nossa equipe no WhatsApp em instantes!
              </span>
            </div>

          </div>

          {/* Right Block - Contact Information & Illustrated Map */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6 sm:gap-8">
            
            {/* Contact Details Board */}
            <div className="bg-white rounded-[2.5rem] border border-[#3A2439]/10 p-6 sm:p-8 shadow-md shadow-[#3A2439]/5 text-left space-y-5">
              
              <h3 className="font-serif text-xl font-bold text-[#3A2439] tracking-tight">
                Canais Diretos de Atendimento
              </h3>

              <div className="space-y-4 font-sans">
                
                {/* Whatsapp direct link */}
                <a
                  href={`https://wa.me/${data.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-emerald-50/70 border border-[#3A2439]/10 hover:border-emerald-200 transition-all group"
                  id="direct_whatsapp_link_card"
                >
                  <div className="p-3 bg-emerald-100 group-hover:bg-emerald-600 group-hover:text-white rounded-xl text-emerald-700 transition-colors shrink-0">
                    <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#3A2439]/60 leading-tight">WhatsApp do Ateliê</h4>
                    <p className="text-base font-extrabold text-[#3A2439] mt-0.5">{data.whatsappFormatted}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold underline block mt-0.5">Falar agora</span>
                  </div>
                </a>

                {/* Instagram link */}
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-pink-50/70 border border-[#3A2439]/10 hover:border-[#E8527A]/30 transition-all group"
                  id="direct_instagram_link_card"
                >
                  <div className="p-3 bg-pink-100 group-hover:bg-[#E8527A] group-hover:text-white rounded-xl text-[#E8527A] transition-colors shrink-0">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#3A2439]/60 leading-tight">Instagram Oficial</h4>
                    <p className="text-base font-extrabold text-[#3A2439] mt-0.5">{data.instagramHandle}</p>
                    <span className="text-[10px] text-[#E8527A] font-semibold underline block mt-0.5">Acompanhar novidades</span>
                  </div>
                </a>

                {/* Location detail */}
                <div className="flex items-start gap-3.5 p-3 rounded-2xl border border-transparent text-[#3A2439]">
                  <div className="p-3 bg-[#FFC947]/30 text-[#3A2439] rounded-xl shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#3A2439]/60 leading-tight">Localização do Ateliê</h4>
                    <p className="text-sm font-extrabold text-[#3A2439] mt-0.5">Brasília, Distrito Federal</p>
                    <p className="text-[11px] text-[#3A2439]/60 leading-normal font-normal mt-0.5">Retirada programada em Brasília ou envio para todo o Brasil via transportadora/Correios.</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Illustrated Map */}
            <div className="bg-white border border-[#3A2439]/10 rounded-[2.5rem] p-6 shadow-md shadow-[#3A2439]/5 text-left relative overflow-hidden flex-1 flex flex-col justify-between min-h-[220px]" id="brasilia_illustrated_map">
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-[#3A2439] text-sm">Ateliê em Brasília • DF</h4>
                  <p className="font-sans text-[10px] text-[#3A2439]/60 uppercase tracking-widest font-semibold">Entregas em todo o DF e Brasil</p>
                </div>
                <span className="bg-[#FFF6F0] text-[9px] font-bold text-[#E8527A] px-2.5 py-1 rounded-full border border-[#E8527A]/20">
                  Brasília - DF
                </span>
              </div>

              {/* Pin indicator */}
              <div className="relative z-10 my-4 flex items-center justify-center">
                <div className="relative flex flex-col items-center">
                  <span className="absolute animate-ping inline-flex h-8 w-8 rounded-full bg-[#E8527A] opacity-25" />
                  <div className="w-10 h-10 rounded-full bg-[#E8527A] text-white flex items-center justify-center shadow-md relative border-2 border-white">
                    <Heart className="w-5 h-5 fill-white" />
                  </div>
                  <span className="text-[10px] font-bold text-[#3A2439] bg-[#FFF6F0] px-2.5 py-0.5 rounded-full border border-[#3A2439]/10 mt-1 shadow-2xs">
                    DL Magic Paper
                  </span>
                </div>
              </div>

              <div className="relative z-10 pt-2 border-t border-[#3A2439]/10 flex justify-between items-center text-[11px] text-[#3A2439]/70 font-sans">
                <span>📍 Ateliê em Brasília</span>
                <span>📦 Envio para Todo o Brasil</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
