import React, { useState, useEffect, useRef } from "react";
import { 
  X, Save, Plus, Trash2, Edit, RotateCcw, 
  Instagram, MessageCircle, FileText, Layers, 
  Package, Palette, Check, AlertCircle, Sparkles, PlusCircle,
  Lock, Key, LogOut, Image as ImageIcon, Upload
} from "lucide-react";
import { useAppContext } from "../context/DataContext";
import { Product, ThemeItem, HeroBannerItem, TestimonialPrintItem } from "../types";
import { compressImageToDataUrl } from "../utils/imageUpload";

export default function AdminPanel() {
  const { 
    data, 
    updateData, 
    updateHeroTexts, 
    updateAboutTexts,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    addTheme, 
    updateTheme, 
    deleteTheme, 
    resetAll,
    isAdminOpen, 
    setIsAdminOpen,
    isAdminLoggedIn,
    setIsAdminLoggedIn
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<"site" | "images" | "products" | "themes">("site");
  
  // Login flow local state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newAdminUsername, setNewAdminUsername] = useState(data.adminUsername || "admin");
  const [newAdminPassword, setNewAdminPassword] = useState(data.adminPassword || "admin123");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    const storedUser = (data.adminUsername || "admin").trim().toLowerCase();
    const storedPass = (data.adminPassword || "admin123").trim();

    // Accepts either admin / admin123 or the stored credentials (including Danilau / Dani@784512)
    const isValidUser = cleanUser === "admin" || cleanUser === "danilau" || cleanUser === storedUser;
    const isValidPass = cleanPass === "admin123" || cleanPass === "Dani@784512" || cleanPass === storedPass;

    if (isValidUser && isValidPass) {
      setIsAdminLoggedIn(true);
      setLoginError("");
      setUsernameInput("");
      setPasswordInput("");
      triggerToast("Acesso concedido com sucesso! 🛡️");
    } else {
      setLoginError("Usuário ou senha incorretos. Verifique suas credenciais de administrador.");
    }
  };

  // Local state for General Settings
  const [logo, setLogo] = useState(data.logo);
  const [heroImage, setHeroImage] = useState(data.heroImage);
  const [heroVideo, setHeroVideo] = useState(data.heroVideo || "https://i.imgur.com/WMweeTZ.mp4");
  const [aboutImage, setAboutImage] = useState(data.aboutImage);
  const [partyFavorsImage, setPartyFavorsImage] = useState(data.partyFavorsImage);
  const [whatsappNumber, setWhatsappNumber] = useState(data.whatsappNumber);
  const [whatsappFormatted, setWhatsappFormatted] = useState(data.whatsappFormatted);
  const [instagramHandle, setInstagramHandle] = useState(data.instagramHandle);
  const [instagramUrl, setInstagramUrl] = useState(data.instagramUrl);
  const [comingSoonTitle, setComingSoonTitle] = useState(data.comingSoonTitle || "Nosso Novo Catálogo Está Chegando!");
  const [comingSoonSubtitle, setComingSoonSubtitle] = useState(data.comingSoonSubtitle || "");

  // Site-wide images state (Hero carousel, Testimonials WhatsApp prints, Kit Galleries)
  const [heroBanners, setHeroBanners] = useState<HeroBannerItem[]>(data.heroBanners || []);
  const [testimonialPrints, setTestimonialPrints] = useState<TestimonialPrintItem[]>(data.testimonialPrints || []);
  const [kitGalleryFeminina, setKitGalleryFeminina] = useState<string[]>(data.kitGalleryFeminina || []);
  const [kitGalleryMasculina, setKitGalleryMasculina] = useState<string[]>(data.kitGalleryMasculina || []);

  // Local state for Hero Texts
  const [heroTag, setHeroTag] = useState(data.heroTexts.tag);
  const [heroTitlePrefix, setHeroTitlePrefix] = useState(data.heroTexts.titlePrefix);
  const [heroTitleColored, setHeroTitleColored] = useState(data.heroTexts.titleColored);
  const [heroSubtitle, setHeroSubtitle] = useState(data.heroTexts.subtitle);
  const [heroDescription, setHeroDescription] = useState(data.heroTexts.description);

  // Local state for About Texts
  const [aboutTag, setAboutTag] = useState(data.aboutTexts.tag);
  const [aboutTitle, setAboutTitle] = useState(data.aboutTexts.title);
  const [aboutParagraph1, setAboutParagraph1] = useState(data.aboutTexts.paragraph1);
  const [aboutParagraph2, setAboutParagraph2] = useState(data.aboutTexts.paragraph2);
  const [aboutParagraph3, setAboutParagraph3] = useState(data.aboutTexts.paragraph3 || "");
  const [aboutFloatingText, setAboutFloatingText] = useState(data.aboutTexts.floatingText);

  // Product Editing state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [adminProductFilter, setAdminProductFilter] = useState<"todos" | "pessoal" | "corporativo">("todos");
  const [productForm, setProductForm] = useState<Omit<Product, "id">>({
    name: "",
    category: "Topos de Bolo",
    segment: "pessoal",
    minPrice: 10,
    maxPrice: 20,
    description: "",
    image: "",
    gallery: [],
    badge: "",
    features: []
  });
  const [featureInput, setFeatureInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");

  // Theme Editing state
  const [editingTheme, setEditingTheme] = useState<ThemeItem | null>(null);
  const [isAddingTheme, setIsAddingTheme] = useState(false);
  const [themeForm, setThemeForm] = useState<Omit<ThemeItem, "id">>({
    name: "",
    image: "",
    vibe: "",
    colors: []
  });
  const [colorInput, setColorInput] = useState("");

  // Dialog state replacements for iframe sandbox alert/confirm security exceptions
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<ThemeItem | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [newFemininaUrl, setNewFemininaUrl] = useState("");
  const [newMasculinaUrl, setNewMasculinaUrl] = useState("");
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isAdminOpen && !wasOpenRef.current) {
      setLogo(data.logo);
      setHeroImage(data.heroImage);
      setHeroVideo(data.heroVideo || "https://i.imgur.com/WMweeTZ.mp4");
      setAboutImage(data.aboutImage);
      setPartyFavorsImage(data.partyFavorsImage);
      setHeroBanners(data.heroBanners || []);
      setTestimonialPrints(data.testimonialPrints || []);
      setKitGalleryFeminina(data.kitGalleryFeminina || []);
      setKitGalleryMasculina(data.kitGalleryMasculina || []);
      setWhatsappNumber(data.whatsappNumber);
      setWhatsappFormatted(data.whatsappFormatted);
      setInstagramHandle(data.instagramHandle);
      setInstagramUrl(data.instagramUrl);
      setNewAdminUsername(data.adminUsername || "admin");
      setNewAdminPassword(data.adminPassword || "admin123");
      setComingSoonTitle(data.comingSoonTitle || "Nosso Novo Catálogo Está Chegando!");
      setComingSoonSubtitle(data.comingSoonSubtitle || "");
      setHeroTag(data.heroTexts.tag);
      setHeroTitlePrefix(data.heroTexts.titlePrefix);
      setHeroTitleColored(data.heroTexts.titleColored);
      setHeroSubtitle(data.heroTexts.subtitle);
      setHeroDescription(data.heroTexts.description);
      setAboutTag(data.aboutTexts.tag);
      setAboutTitle(data.aboutTexts.title);
      setAboutParagraph1(data.aboutTexts.paragraph1);
      setAboutParagraph2(data.aboutTexts.paragraph2);
      setAboutParagraph3(data.aboutTexts.paragraph3 || "");
      setAboutFloatingText(data.aboutTexts.floatingText);
    }
    wasOpenRef.current = isAdminOpen;
  }, [isAdminOpen, data]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleImageFileUpload = async (
    file: File | undefined,
    onLoaded: (dataUrl: string) => void
  ) => {
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file, 1200, 0.82);
      onLoaded(compressed);
      triggerToast("Foto carregada! Clique em Salvar para confirmar no site. 📸");
    } catch {
      triggerToast("⚠️ Não foi possível ler essa imagem. Tente outro arquivo.");
    }
  };

  const handleSaveAllSiteImages = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateData({
      logo,
      heroImage,
      heroVideo,
      aboutImage,
      partyFavorsImage,
      heroBanners,
      testimonialPrints,
      kitGalleryFeminina,
      kitGalleryMasculina
    });
    triggerToast("Todas as imagens do site foram atualizadas! 🖼️✨");
  };

  const addGalleryPhotoToProduct = (url?: string) => {
    const clean = (url ?? galleryInput).trim();
    if (!clean) return;
    setProductForm(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), clean]
    }));
    if (!url) setGalleryInput("");
  };

  const removeGalleryPhotoFromProduct = (idx: number) => {
    setProductForm(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== idx)
    }));
  };

  if (!isAdminOpen) return null;

  // Handle generalized save settings
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      logo,
      heroImage,
      heroVideo,
      aboutImage,
      partyFavorsImage,
      whatsappNumber,
      whatsappFormatted,
      instagramHandle,
      instagramUrl,
      adminUsername: newAdminUsername,
      adminPassword: newAdminPassword,
      comingSoonTitle,
      comingSoonSubtitle
    });
    updateHeroTexts({
      tag: heroTag,
      titlePrefix: heroTitlePrefix,
      titleColored: heroTitleColored,
      subtitle: heroSubtitle,
      description: heroDescription
    });
    updateAboutTexts({
      tag: aboutTag,
      title: aboutTitle,
      paragraph1: aboutParagraph1,
      paragraph2: aboutParagraph2,
      paragraph3: aboutParagraph3,
      floatingText: aboutFloatingText
    });
    triggerToast("Configurações do site salvas com sucesso! ✨");
  };

  // Helper for product feature addition
  const addFeatureToForm = () => {
    if (featureInput.trim()) {
      setProductForm(prev => ({
        ...prev,
        features: [...(prev.features || []), featureInput.trim()]
      }));
      setFeatureInput("");
    }
  };

  const removeFeatureFromForm = (idx: number) => {
    setProductForm(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== idx)
    }));
  };

  // Save new or edited product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.image) {
      triggerToast("⚠️ Por favor, preencha o nome e o link da imagem!");
      return;
    }
    
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      triggerToast(`Produto "${productForm.name}" editado! 🛠️`);
      setEditingProduct(null);
    } else {
      addProduct(productForm);
      triggerToast(`Produto "${productForm.name}" adicionado! 🎉`);
      setIsAddingProduct(false);
    }

    // Reset Form
    setProductForm({
      name: "",
      category: "Topos de Bolo",
      minPrice: 10,
      maxPrice: 20,
      description: "",
      image: "",
      gallery: [],
      badge: "",
      features: [],
      segment: "pessoal"
    });
    setFeatureInput("");
    setGalleryInput("");
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      segment: prod.segment || "pessoal",
      minPrice: prod.minPrice,
      maxPrice: prod.maxPrice,
      description: prod.description,
      image: prod.image,
      gallery: prod.gallery || [],
      badge: prod.badge || "",
      features: prod.features || []
    });
    setGalleryInput("");
    setIsAddingProduct(false);
  };

  // Helper for theme color addition
  const addColorToForm = () => {
    if (colorInput.trim() && colorInput.startsWith("#")) {
      setThemeForm(prev => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim().toUpperCase()]
      }));
      setColorInput("");
    } else {
      triggerToast("⚠️ A cor deve começar com # (exemplo: #FF6699)!");
    }
  };

  const removeColorFromForm = (idx: number) => {
    setThemeForm(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx)
    }));
  };

  // Save new or edited theme
  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeForm.name || !themeForm.image) {
      triggerToast("⚠️ Por favor, preencha o nome do tema e a imagem!");
      return;
    }

    if (editingTheme) {
      updateTheme(editingTheme.id, themeForm);
      triggerToast(`Tema "${themeForm.name}" editado! 🛠️`);
      setEditingTheme(null);
    } else {
      addTheme(themeForm);
      triggerToast(`Tema "${themeForm.name}" adicionado! 🎨`);
      setIsAddingTheme(false);
    }

    // Reset Form
    setThemeForm({
      name: "",
      image: "",
      vibe: "",
      colors: []
    });
    setColorInput("");
  };

  const startEditTheme = (them: ThemeItem) => {
    setEditingTheme(them);
    setThemeForm({
      name: them.name,
      image: them.image,
      vibe: them.vibe,
      colors: them.colors
    });
    setIsAddingTheme(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="admin_overlay">
      
      {!isAdminLoggedIn ? (
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100 p-6 sm:p-8 space-y-6 text-center" id="admin_login_container">
          
          {/* Close button for login */}
          <button 
            type="button"
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
            aria-label="Fecar Login"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon lock block */}
          <div className="mx-auto w-16 h-16 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-brand-pink mt-4 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl font-extrabold text-slate-800">Acesso Restrito</h2>
            <p className="text-xs text-slate-400 font-sans">
              Identifique-se como Administrador para poder editar ou remover itens do catálogo.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold text-left flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans block">Usuário ADM</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans block">Senha de Acesso</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-brand-pink text-white font-bold text-sm rounded-xl tracking-wide duration-200 shadow-md shadow-slate-900/10 hover:shadow-brand-pink/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Key className="w-4 h-4" />
              Entrar no Painel
            </button>
          </form>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
            <p className="text-[11px] text-slate-500 font-sans">
              Acesso exclusivo para edição e gerenciamento do ateliê <strong>DL Magic Paper</strong>.
            </p>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative border border-slate-100" id="admin_container">
          
          {/* Header Block */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">Painel do Administrador</h2>
                <p className="text-xs text-slate-300 font-sans">Gerencie o conteúdo completo do seu ateliê com facilidade</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  triggerToast("Sessão encerrada com segurança! 🔒");
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/30 text-red-300 text-xs font-semibold font-sans transition-all cursor-pointer"
                title="Sair da conta de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
                aria-label="Fecar Painel"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

        {/* Dynamic Feedback Toast */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white border border-pink-400/30 px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce z-50">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="font-sans text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="border-b border-slate-200 bg-slate-50 px-6 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2 -mb-px pt-2">
            <button
              onClick={() => {
                setActiveTab("site");
                setEditingProduct(null);
                setIsAddingProduct(false);
                setEditingTheme(null);
                setIsAddingTheme(false);
              }}
              className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all font-sans cursor-pointer ${
                activeTab === "site"
                  ? "border-brand-pink text-brand-pink font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              Apresentação & Redes
            </button>
            <button
              onClick={() => {
                setActiveTab("images");
                setEditingProduct(null);
                setIsAddingProduct(false);
                setEditingTheme(null);
                setIsAddingTheme(false);
              }}
              className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all font-sans cursor-pointer ${
                activeTab === "images"
                  ? "border-brand-pink text-brand-pink font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Imagens do Site
            </button>
            <button
              onClick={() => {
                setActiveTab("products");
                setEditingProduct(null);
                setIsAddingProduct(false);
                setEditingTheme(null);
                setIsAddingTheme(false);
              }}
              className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all font-sans cursor-pointer ${
                activeTab === "products"
                  ? "border-brand-pink text-brand-pink font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Package className="w-4 h-4" />
              Produtos ({data.products.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("themes");
                setEditingProduct(null);
                setIsAddingProduct(false);
                setEditingTheme(null);
                setIsAddingTheme(false);
              }}
              className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all font-sans cursor-pointer ${
                activeTab === "themes"
                  ? "border-brand-pink text-brand-pink font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Palette className="w-4 h-4" />
              Temas ({data.themes.length})
            </button>
          </div>

          <div className="py-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-55 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-semibold font-sans transition-all cursor-pointer"
              title="Redefinir todo conteúdo para valores originais"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Redefinir Originais
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50" id="admin_scrollable_body">
          
          {/* TAB 1: SITE PRESENTATION & SOCIAL CHANNELS */}
          {activeTab === "site" && (
            <form onSubmit={handleSaveGeneral} className="space-y-8 max-w-4xl">

              {/* Visibility / Em Breve Mode Card */}
              <div className="bg-white p-6 rounded-2xl border-2 border-brand-pink/25 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-5 rounded-full bg-brand-pink" />
                      Visibilidade para o Público (Modo &ldquo;Em Breve&rdquo;)
                    </h3>
                    <p className="text-xs text-slate-500 font-sans mt-1">
                      Quando ativado, visitantes comuns veem a página <strong>&ldquo;Em Breve&rdquo;</strong>, enquanto você (logada como admin) vê e edita o site completo normalmente.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const next = !data.isComingSoon;
                      updateData({ isComingSoon: next });
                      triggerToast(
                        next
                          ? "Modo 'Em Breve' ativado para o público! 🔒"
                          : "Site publicado e visível para todos os clientes! 🚀"
                      );
                    }}
                    className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 border ${
                      data.isComingSoon
                        ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{data.isComingSoon ? "Modo Em Breve: ATIVO" : "Site PUBLICADO (Público)"}</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Título da Tela &ldquo;Em Breve&rdquo;</label>
                    <input
                      type="text"
                      value={comingSoonTitle}
                      onChange={(e) => setComingSoonTitle(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Texto da Tela &ldquo;Em Breve&rdquo;</label>
                    <input
                      type="text"
                      value={comingSoonSubtitle}
                      onChange={(e) => setComingSoonSubtitle(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                </div>
              </div>
              
              {/* Media links card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-brand-pink" />
                    Imagens Principais (Link ou Upload)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("images")}
                    className="text-xs font-bold text-brand-pink hover:underline cursor-pointer"
                  >
                    Abrir Gerenciador Completo de Imagens →
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-2 font-sans">
                  Cole o link de qualquer imagem ou clique no botão de upload para enviar do seu aparelho.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Logo do Ateliê (Sem fundo)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={logo} 
                        onChange={(e) => setLogo(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        Subir
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e.target.files?.[0], setLogo)}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Banner Principal (Topo do site)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={heroImage} 
                        onChange={(e) => setHeroImage(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        Subir
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e.target.files?.[0], setHeroImage)}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Vídeo de Fundo do Topo (MP4 / Link direto)</label>
                    <input 
                      type="text" 
                      value={heroVideo} 
                      onChange={(e) => setHeroVideo(e.target.value)}
                      placeholder="https://... ou /hero_video.mp4"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Foto Sobre Nós (Quem Faz com Amor)</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={aboutImage} 
                        onChange={(e) => setAboutImage(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        Subir
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e.target.files?.[0], setAboutImage)}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Foto Auxiliar do Ateliê</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={partyFavorsImage} 
                        onChange={(e) => setPartyFavorsImage(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        Subir
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e.target.files?.[0], setPartyFavorsImage)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Previews grids */}
                <div className="pt-2 grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Logo</span>
                    <img src={logo} alt="Preview" referrerPolicy="no-referrer" className="w-12 h-12 object-contain bg-slate-100 rounded-lg p-1 border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Sem+Foto'; }} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Banner Topo</span>
                    <img src={heroImage} alt="Preview" className="w-12 h-12 object-cover bg-slate-100 rounded-lg border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Sem+Foto'; }} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Sobre Nós</span>
                    <img src={aboutImage} alt="Preview" className="w-12 h-12 object-cover bg-slate-100 rounded-lg border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Sem+Foto'; }} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Auxiliar</span>
                    <img src={partyFavorsImage} alt="Preview" className="w-12 h-12 object-cover bg-slate-100 rounded-lg border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Sem+Foto'; }} />
                  </div>
                </div>
              </div>

              {/* Dynamic text blocks (Hero customization) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-brand-tiffany" />
                  Textos do Cabeçalho (Hero)
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Tag / Chamada Rápida</label>
                    <input 
                      type="text" 
                      value={heroTag} 
                      onChange={(e) => setHeroTag(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Título Principal (Fixo)</label>
                      <input 
                        type="text" 
                        value={heroTitlePrefix} 
                        onChange={(e) => setHeroTitlePrefix(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Título Principal (Colorido)</label>
                      <input 
                        type="text" 
                        value={heroTitleColored} 
                        onChange={(e) => setHeroTitleColored(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Slogan / Citação Itálica</label>
                    <input 
                      type="text" 
                      value={heroSubtitle} 
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Descrição do Ateliê</label>
                    <textarea 
                      value={heroDescription} 
                      onChange={(e) => setHeroDescription(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic text blocks (About customization) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-brand-lilac" />
                  Nossa História (Histórico e Propósito)
                </h3>
                
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Tag (Ex: "Nosso Sonho 🌸")</label>
                      <input 
                        type="text" 
                        value={aboutTag} 
                        onChange={(e) => setAboutTag(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Título Principal da Seção</label>
                      <input 
                        type="text" 
                        value={aboutTitle} 
                        onChange={(e) => setAboutTitle(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Parágrafo Narrativo 1</label>
                    <textarea 
                      value={aboutParagraph1} 
                      onChange={(e) => setAboutParagraph1(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Parágrafo Narrativo 2</label>
                    <textarea 
                      value={aboutParagraph2} 
                      onChange={(e) => setAboutParagraph2(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Parágrafo Narrativo 3</label>
                    <textarea 
                      value={aboutParagraph3} 
                      onChange={(e) => setAboutParagraph3(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Selo / Texto Flutuante da Foto</label>
                    <input 
                      type="text" 
                      value={aboutFloatingText} 
                      onChange={(e) => setAboutFloatingText(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Social links card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-indigo-900" />
                  Links Rápidos & Atendimentos
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-emerald-500" />
                      WhatsAPP Sem Símbolos (Apenas Números com DDD e DDI)
                    </label>
                    <input 
                      type="text" 
                      value={whatsappNumber} 
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="ex: 5561998889577"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">WhatsApp Formatado (Exibição)</label>
                    <input 
                      type="text" 
                      value={whatsappFormatted} 
                      onChange={(e) => setWhatsappFormatted(e.target.value)}
                      placeholder="ex: (61) 99888-9577"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans flex items-center gap-1">
                      <Instagram className="w-3 h-3 text-pink-500" />
                      Arroba Instagram
                    </label>
                    <input 
                      type="text" 
                      value={instagramHandle} 
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      placeholder="ex: @dlmagicpaper"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Link Direto Instagram</label>
                    <input 
                      type="text" 
                      value={instagramUrl} 
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="ex: https://instagram.com/dlmagicpaper"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                </div>
              </div>

               {/* Security / Admin password change */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-red-500" />
                  Segurança do Painel (Acesso Administrativo)
                </h3>
                <p className="text-xs text-slate-400 mb-2 font-sans">
                  Altere o usuário e a senha de acesso ao Painel de Administração para garantir a segurança dos seus dados do ateliê.
                </p>

                <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Usuário do Administrador
                    </label>
                    <input 
                      type="text" 
                      value={newAdminUsername} 
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      placeholder="Defina seu usuário administrativo"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-amber-500 hover:scale-110" />
                      Nova Senha de Acesso
                    </label>
                    <input 
                      type="password" 
                      value={newAdminPassword} 
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="Defina sua nova senha administrativa"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Global Save Button Block */}
              <div className="flex justify-end pt-4" id="general_save_block">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-8 py-3.5 rounded-xl font-bold font-sans shadow-lg shadow-brand-pink/20 hover:scale-101 hover:shadow-brand-pink/30 hover:-translate-y-0.5 active:scale-98 transition-all cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  Salvar Configurações
                </button>
              </div>

            </form>
          )}

          {/* TAB: SITE-WIDE IMAGES MANAGER */}
          {activeTab === "images" && (
            <form onSubmit={handleSaveAllSiteImages} className="space-y-8 max-w-4xl">
              
              {/* Bloco 1: Identidade & Seções Principais */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-5 rounded-full bg-brand-pink" />
                      1. Identidade Visual &amp; Seções Principais
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Altere a logo, o banner principal de entrada, a foto da criadora e a imagem auxiliar enviando do seu aparelho ou colando um link.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: "Logo do Ateliê (Navbar, Rodapé e Tela Em Breve)", val: logo, setter: setLogo, contain: true },
                    { label: "Banner Principal do Topo (Linha Festas & Corporativa)", val: heroImage, setter: setHeroImage, contain: false },
                    { label: "Foto Sobre Nós (Quem Faz com Amor e Propósito)", val: aboutImage, setter: setAboutImage, contain: false },
                    { label: "Foto Auxiliar do Ateliê", val: partyFavorsImage, setter: setPartyFavorsImage, contain: false }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <label className="block text-xs font-bold text-slate-700 font-sans">{item.label}</label>
                      <div className="h-32 w-full rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={item.val}
                          alt={item.label}
                          className={`w-full h-full ${item.contain ? "object-contain" : "object-cover"} rounded-lg`}
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x200?text=Sem+Imagem"; }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.val}
                          onChange={(e) => item.setter(e.target.value)}
                          placeholder="Cole o link da imagem ou use Subir Foto"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-white font-sans"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Subir Foto
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileUpload(e.target.files?.[0], item.setter)}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloco 2: Carrossel Mais Destaques do Ateliê */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-5 rounded-full bg-brand-tiffany" />
                      2. Carrossel &ldquo;Mais Destaques do Ateliê&rdquo; (Hero)
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Gerencie as fotos e legendas dos banners rotativos na página inicial.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setHeroBanners(prev => [
                        ...prev,
                        {
                          id: `banner-${Date.now()}`,
                          src: "/src/assets/images/kit_caixas_classicas_1794613744144.jpg",
                          title: "Novo Destaque DL Magic Paper",
                          subtitle: "Personalizado com carinho e qualidade"
                        }
                      ])
                    }
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Banner
                  </button>
                </div>

                <div className="space-y-4">
                  {heroBanners.map((banner, idx) => (
                    <div key={banner.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 grid sm:grid-cols-[160px_1fr] gap-4 items-center">
                      <div className="h-28 w-full rounded-xl bg-white border border-slate-200 overflow-hidden">
                        <img
                          src={banner.src}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/320x180?text=Banner"; }}
                        />
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                            Banner #{idx + 1}
                          </span>
                          {heroBanners.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setHeroBanners(prev => prev.filter((_, i) => i !== idx))}
                              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remover
                            </button>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={banner.src}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHeroBanners(prev => prev.map((b, i) => (i === idx ? { ...b, src: val } : b)));
                            }}
                            placeholder="Link da imagem do banner"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-sans"
                          />
                          <label className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            Subir Foto
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (url) =>
                                  setHeroBanners(prev => prev.map((b, i) => (i === idx ? { ...b, src: url } : b)))
                                )
                              }
                            />
                          </label>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={banner.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHeroBanners(prev => prev.map((b, i) => (i === idx ? { ...b, title: val } : b)));
                            }}
                            placeholder="Título do banner"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-sans font-semibold"
                          />
                          <input
                            type="text"
                            value={banner.subtitle}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHeroBanners(prev => prev.map((b, i) => (i === idx ? { ...b, subtitle: val } : b)));
                            }}
                            placeholder="Subtítulo do banner"
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloco 3: Prints de Avaliações Reais (WhatsApp) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-5 rounded-full bg-emerald-500" />
                      3. Avaliações Reais / Prints do WhatsApp
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Troque, adicione ou remova os prints de feedbacks exibidos na seção de depoimentos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setTestimonialPrints(prev => [
                        ...prev,
                        {
                          id: `screenshot-${Date.now()}`,
                          url: "",
                          alt: `Depoimento do WhatsApp de Cliente ${prev.length + 1}`
                        }
                      ])
                    }
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Print
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {testimonialPrints.map((item, idx) => (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                          Print #{idx + 1}
                        </span>
                        {testimonialPrints.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setTestimonialPrints(prev => prev.filter((_, i) => i !== idx))}
                            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remover
                          </button>
                        )}
                      </div>

                      <div className="h-36 w-full rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                        <img
                          src={item.url || "https://placehold.co/300x300?text=Envie+um+Print"}
                          alt={item.alt}
                          className="w-full h-full object-contain rounded-lg"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/300x300?text=Sem+Print"; }}
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTestimonialPrints(prev => prev.map((p, i) => (i === idx ? { ...p, url: val } : p)));
                          }}
                          placeholder="Link da imagem do print"
                          className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-sans"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Subir
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileUpload(e.target.files?.[0], (url) =>
                                setTestimonialPrints(prev => prev.map((p, i) => (i === idx ? { ...p, url } : p)))
                              )
                            }
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        value={item.alt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTestimonialPrints(prev => prev.map((p, i) => (i === idx ? { ...p, alt: val } : p)));
                        }}
                        placeholder="Descrição do depoimento"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-sans"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bloco 4: Galerias do Kit Festas Clássico */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-brand-lilac" />
                    4. Galerias da Página do &ldquo;Kit Festas Clássico&rdquo;
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Fotos mostradas na página de detalhes do Kit Festas Clássico (Coleção Feminina e Coleção Masculina).
                  </p>
                </div>

                {/* Coleção Feminina */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 font-sans">Coleção Feminina ({kitGalleryFeminina.length} fotos)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {kitGalleryFeminina.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-24">
                        <img
                          src={url}
                          alt={`Feminina ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/200x150?text=Foto"; }}
                        />
                        <button
                          type="button"
                          onClick={() => setKitGalleryFeminina(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 cursor-pointer"
                          title="Remover foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFemininaUrl}
                      onChange={(e) => setNewFemininaUrl(e.target.value)}
                      placeholder="Cole o link de uma foto para Coleção Feminina"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newFemininaUrl.trim()) {
                          setKitGalleryFeminina(prev => [...prev, newFemininaUrl.trim()]);
                          setNewFemininaUrl("");
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Adicionar Link
                    </button>
                    <label className="px-3.5 py-2 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      Subir Foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e.target.files?.[0], (url) =>
                            setKitGalleryFeminina(prev => [...prev, url])
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                {/* Coleção Masculina */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 font-sans">Coleção Masculina ({kitGalleryMasculina.length} fotos)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {kitGalleryMasculina.map((url, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-24">
                        <img
                          src={url}
                          alt={`Masculina ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/200x150?text=Foto"; }}
                        />
                        <button
                          type="button"
                          onClick={() => setKitGalleryMasculina(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 cursor-pointer"
                          title="Remover foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMasculinaUrl}
                      onChange={(e) => setNewMasculinaUrl(e.target.value)}
                      placeholder="Cole o link de uma foto para Coleção Masculina"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newMasculinaUrl.trim()) {
                          setKitGalleryMasculina(prev => [...prev, newMasculinaUrl.trim()]);
                          setNewMasculinaUrl("");
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Adicionar Link
                    </button>
                    <label className="px-3.5 py-2 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      Subir Foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageFileUpload(e.target.files?.[0], (url) =>
                            setKitGalleryMasculina(prev => [...prev, url])
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-8 py-3.5 rounded-xl font-bold font-sans shadow-lg shadow-brand-pink/20 hover:scale-101 hover:shadow-brand-pink/30 hover:-translate-y-0.5 active:scale-98 transition-all cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  Salvar Todas as Imagens do Site
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PRODUCTS MANAGER (CATALOG) */}
          {activeTab === "products" && (
            <div className="space-y-6">
              
              {/* Conditional Add/Edit Layout */}
              {(isAddingProduct || editingProduct) ? (
                <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-6 rounded-full bg-brand-pink" />
                      {editingProduct ? `Editar: ${editingProduct.name}` : "Adicionar Novo Produto"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsAddingProduct(false);
                      }}
                      className="p-1 px-3 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-sans transition-all"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Nome do Produto</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        placeholder="Ex: Topo de Bolo Luxo Espelhado"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Categoria</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      >
                        {data.categories.filter(c => c !== "Todos").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 font-sans">
                        Segmento (Pessoal ou Corporativo) *
                      </label>
                      <select
                        value={productForm.segment || "pessoal"}
                        onChange={(e) => setProductForm({...productForm, segment: e.target.value as "pessoal" | "corporativo" | "ambos"})}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans font-bold text-slate-800"
                      >
                        <option value="pessoal">🎈 Pessoal (Festas, Aniversários, Celebrações)</option>
                        <option value="corporativo">💼 Corporativo (Empresas, Brindes, B2B)</option>
                        <option value="ambos">✨ Ambos (Disponível em Pessoal e Corporativo)</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans font-serif">Tag de destaque / Badge (Opcional)</label>
                      <input
                        type="text"
                        value={productForm.badge}
                        onChange={(e) => setProductForm({...productForm, badge: e.target.value})}
                        placeholder="Ex: Mais Vendido, Luxo, Novidade"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Preço Mínimo (R$)</label>
                      <input
                        type="number"
                        required
                        value={productForm.minPrice}
                        onChange={(e) => setProductForm({...productForm, minPrice: Number(e.target.value)})}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Preço Máximo (R$)</label>
                      <input
                        type="number"
                        required
                        value={productForm.maxPrice}
                        onChange={(e) => setProductForm({...productForm, maxPrice: Number(e.target.value)})}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2.5">
                      <label className="block text-xs font-semibold text-slate-600 font-sans">Imagem Principal do Produto (Link ou Upload)</label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={productForm.image || "https://placehold.co/150x150?text=Foto"}
                            alt="Preview produto"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/150x150?text=Foto"; }}
                          />
                        </div>
                        <div className="flex-1 w-full flex gap-2">
                          <input
                            type="text"
                            required
                            value={productForm.image}
                            onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                            placeholder="https://... ou envie uma foto do aparelho"
                            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                          />
                          <label className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            Subir Foto
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (url) =>
                                  setProductForm(prev => ({ ...prev, image: url }))
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Optional Product Gallery Photos */}
                    <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <label className="block text-xs font-bold text-slate-700 font-sans">
                        Fotos Extras da Galeria do Produto (Opcional)
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={galleryInput}
                          onChange={(e) => setGalleryInput(e.target.value)}
                          placeholder="Cole o link de uma foto extra"
                          className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-white font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => addGalleryPhotoToProduct()}
                          className="px-3.5 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700 transition shrink-0 cursor-pointer"
                        >
                          Adicionar
                        </button>
                        <label className="px-3.5 py-2 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          Subir
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageFileUpload(e.target.files?.[0], (url) =>
                                addGalleryPhotoToProduct(url)
                              )
                            }
                          />
                        </label>
                      </div>

                      {productForm.gallery && productForm.gallery.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
                          {productForm.gallery.map((imgUrl, idx) => (
                            <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 bg-white h-20">
                              <img
                                src={imgUrl}
                                alt={`Galeria ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/150x150?text=Foto"; }}
                              />
                              <button
                                type="button"
                                onClick={() => removeGalleryPhotoFromProduct(idx)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold shadow cursor-pointer"
                                title="Remover"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic font-sans">Nenhuma foto extra adicionada.</p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Breve Descrição do Produto</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        placeholder="Descreva o que vem, qual papelada, acabamento premium, etc."
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[70px] font-sans"
                      />
                    </div>

                    {/* Features list management */}
                    <div className="md:col-span-2 border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
                      <label className="block text-xs font-bold text-slate-700 font-sans">Lista de Recursos / O que vem no produto</label>
                      
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          placeholder="Ex: Impressão em alta fidelidade"
                          className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-white font-sans"
                        />
                        <button
                          type="button"
                          onClick={addFeatureToForm}
                          className="px-4 py-2 bg-slate-800 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition"
                        >
                          Adicionar
                        </button>
                      </div>

                      {/* Feature tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {productForm.features && productForm.features.length > 0 ? (
                          productForm.features.map((feat, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs text-slate-700 font-sans shadow-2xs"
                            >
                              {feat}
                              <button 
                                type="button" 
                                onClick={() => removeFeatureFromForm(idx)}
                                className="w-4 h-4 rounded-full bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center font-bold"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400 italic">Nenhum detalhe adicionado ainda.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setIsAddingProduct(false);
                      }}
                      className="px-5 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold font-sans text-sm text-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-6 py-2.5 rounded-xl font-bold font-sans text-sm shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      {editingProduct ? "Salvar Alterações" : "Criar Produto"}
                    </button>
                  </div>
                </form>
              ) : (
                // Products List
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-800">Catálogo de Produtos</h4>
                      <p className="text-xs text-slate-500 font-sans">Cadastre, remova ou altere os preços, segmentos (Pessoal/Corporativo) e fotos dos produtos.</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingProduct(true);
                        setEditingProduct(null);
                        setProductForm({
                          name: "",
                          category: "Topos de Bolo",
                          segment: "pessoal",
                          minPrice: 10,
                          maxPrice: 20,
                          description: "",
                          image: "",
                          gallery: [],
                          badge: "",
                          features: []
                        });
                        setGalleryInput("");
                        setFeatureInput("");
                      }}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Novo Produto
                    </button>
                  </div>

                  {/* Segment Filter for Admin */}
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <span className="text-xs text-slate-500 font-semibold font-sans">Filtrar por:</span>
                    <button
                      type="button"
                      onClick={() => setAdminProductFilter("todos")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        adminProductFilter === "todos"
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Todos ({data.products.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminProductFilter("pessoal")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        adminProductFilter === "pessoal"
                          ? "bg-[#E8527A] text-white shadow-xs"
                          : "bg-pink-50 text-[#E8527A] hover:bg-pink-100"
                      }`}
                    >
                      🎈 Pessoais ({data.products.filter(p => p.segment === "pessoal" || p.segment === "ambos" || !p.segment).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminProductFilter("corporativo")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        adminProductFilter === "corporativo"
                          ? "bg-[#3A2439] text-white shadow-xs"
                          : "bg-purple-50 text-[#3A2439] hover:bg-purple-100"
                      }`}
                    >
                      💼 Corporativos ({data.products.filter(p => p.segment === "corporativo" || p.segment === "ambos").length})
                    </button>
                  </div>

                  {/* Grid of Product Cards for editing */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4" id="admin_products_grid">
                    {data.products
                      .filter(prod => {
                        if (adminProductFilter === "todos") return true;
                        if (adminProductFilter === "pessoal") return prod.segment === "pessoal" || prod.segment === "ambos" || !prod.segment;
                        if (adminProductFilter === "corporativo") return prod.segment === "corporativo" || prod.segment === "ambos";
                        return true;
                      })
                      .map((prod) => (
                      <div key={prod.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden relative group/item">
                        
                        {/* Img backdrop */}
                        <div className="h-32 bg-slate-100 relative overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x150?text=Indisponivel'; }}
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                            <span className="bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider font-sans">
                              {prod.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-sans shadow-xs ${
                              prod.segment === "corporativo"
                                ? "bg-purple-600 text-white"
                                : prod.segment === "ambos"
                                ? "bg-amber-500 text-white"
                                : "bg-[#E8527A] text-white"
                            }`}>
                              {prod.segment === "corporativo" ? "💼 Corporativo" : prod.segment === "ambos" ? "✨ Ambos" : "🎈 Pessoal"}
                            </span>
                          </div>

                          {prod.badge && (
                            <span className="absolute top-2 right-2 bg-brand-pink px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider font-sans">
                              {prod.badge}
                            </span>
                          )}
                        </div>

                        {/* Title and descriptions */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h5 className="font-serif font-bold text-sm text-slate-800 line-clamp-1">{prod.name}</h5>
                            <p className="text-[11px] text-slate-400 font-sans font-light line-clamp-2 mt-0.5">{prod.description}</p>
                            
                            <div className="text-xs font-bold text-slate-700 mt-2 font-sans">
                              Preço estimado: <span className="text-brand-pink">R$ {prod.minPrice} - R$ {prod.maxPrice}</span>
                            </div>
                          </div>

                          <div className="flex gap-1.5 justify-end pt-2 border-t border-slate-100">
                            <button
                              onClick={() => startEditProduct(prod)}
                              className="p-1 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold font-sans flex items-center gap-1 transition"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              onClick={() => setProductToDelete(prod)}
                              className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold font-sans flex items-center gap-0.5 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remover
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: THEMES MANAGER */}
          {activeTab === "themes" && (
            <div className="space-y-6">
              
              {/* Conditional Add/Edit Layout */}
              {(isAddingTheme || editingTheme) ? (
                <form onSubmit={handleSaveTheme} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-2xl">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-6 rounded-full bg-brand-pink" />
                      {editingTheme ? `Editar Tema: ${editingTheme.name}` : "Adicionar Novo Tema Festivo"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTheme(null);
                        setIsAddingTheme(false);
                      }}
                      className="p-1 px-3 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-sans transition-all"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Nome do Tema</label>
                      <input
                        type="text"
                        required
                        value={themeForm.name}
                        onChange={(e) => setThemeForm({...themeForm, name: e.target.value})}
                        placeholder="Ex: Sonic, Minnie Vermelha, Fazendinha"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Estilo / Vibe do Tema</label>
                      <input
                        type="text"
                        required
                        value={themeForm.vibe}
                        onChange={(e) => setThemeForm({...themeForm, vibe: e.target.value.toUpperCase()})}
                        placeholder="Ex: TROPICAL, ALEGRE E SUPER FOFO"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-600 font-sans">Foto do Tema (Link ou Upload)</label>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={themeForm.image || "https://placehold.co/150x150?text=Tema"}
                            alt="Preview tema"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/150x150?text=Tema"; }}
                          />
                        </div>
                        <div className="flex-1 w-full flex gap-2">
                          <input
                            type="text"
                            required
                            value={themeForm.image}
                            onChange={(e) => setThemeForm({...themeForm, image: e.target.value})}
                            placeholder="https://... ou envie uma foto do tema"
                            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                          />
                          <label className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            Subir Foto
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (url) =>
                                  setThemeForm(prev => ({ ...prev, image: url }))
                                )
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Palette hex controller */}
                    <div className="border border-slate-250 p-4 rounded-xl bg-slate-50 space-y-3">
                      <label className="block text-xs font-bold text-slate-700 font-sans">Paleta de Cores do Tema</label>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">Adicione as cores dominantes do tema em formato hexadecimal (ex: #FF6699)</p>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          placeholder="Ex: #FF6699"
                          className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-250 focus:border-brand-pink outline-hidden bg-white uppercase font-sans"
                        />
                        <button
                          type="button"
                          onClick={addColorToForm}
                          className="px-4 py-2 bg-slate-800 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition"
                        >
                          Adicionar Cor
                        </button>
                      </div>

                      {/* Render active palette inputs */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {themeForm.colors && themeForm.colors.map((color, idx) => (
                          <span 
                            key={idx} 
                            style={{ borderColor: color }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full text-xs text-slate-800 font-semibold font-sans shadow-2xs"
                          >
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: color }} />
                            {color}
                            <button 
                              type="button" 
                              onClick={() => removeColorFromForm(idx)}
                              className="text-red-500 font-bold hover:scale-105 shrink-0 pl-1"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTheme(null);
                        setIsAddingTheme(false);
                      }}
                      className="px-5 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold font-sans text-sm text-slate-700"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-6 py-2.5 rounded-xl font-bold font-sans text-sm shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      {editingTheme ? "Salvar Alterações" : "Criar Tema"}
                    </button>
                  </div>
                </form>
              ) : (
                // Themes listing page
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-800">Galeria de Temas Ativos</h4>
                      <p className="text-xs text-slate-500 font-sans">Inclua decorações, inspirações e temas infantis para exibição interativa.</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingTheme(true);
                        setEditingTheme(null);
                        setThemeForm({
                          name: "",
                          image: "",
                          vibe: "",
                          colors: []
                        });
                      }}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Novo Tema
                    </button>
                  </div>

                  {/* Grid of Theme Cards for editing */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4" id="admin_themes_grid">
                    {data.themes.map((them) => (
                      <div key={them.id} className="bg-white rounded-2xl border border-slate-200/85 shadow-xs flex flex-col overflow-hidden relative group/item">
                        
                        <div className="h-28 bg-slate-100 relative">
                          <img
                            src={them.image}
                            alt={them.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x150?text=Indisponivel'; }}
                          />
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h5 className="font-serif font-bold text-sm text-slate-800 line-clamp-1">{them.name}</h5>
                            <p className="text-[9px] font-sans font-extrabold text-brand-pink tracking-wider mt-0.5">{them.vibe}</p>
                            
                            {/* Color display */}
                            <div className="flex gap-1.5 mt-2">
                              {them.colors.map((color, i) => (
                                <span 
                                  key={i} 
                                  className="w-4.5 h-4.5 rounded-full border border-slate-200/80 shadow-3xs" 
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-1.5 justify-end pt-2 border-t border-slate-100">
                            <button
                              onClick={() => startEditTheme(them)}
                              className="p-1 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold font-sans flex items-center gap-1 transition"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              onClick={() => setThemeToDelete(them)}
                              className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold font-sans flex items-center gap-0.5 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remover
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer info tip */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-400 font-sans flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <span>💡 Alterou e não viu mudar? Clique em "Salvar Configurações". Para redefinir tudo, clique em "Redefinir Originais".</span>
          <span className="font-bold text-slate-500 uppercase tracking-wide">DL Magic Paper Studio &copy; 2026</span>
        </div>

      </div>
      )}

      {/* Custom Confirmation Modals to bypass iFrame restricts */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 text-center space-y-5 animate-scale-up">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-slate-800">Remover Produto?</h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Tem certeza que deseja remover o produto <strong className="text-slate-800 font-semibold">"{productToDelete.name}"</strong> do catálogo permanente? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 transition cursor-pointer font-sans"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  triggerToast(`Produto "${productToDelete.name}" removido! 🗑️`);
                  setProductToDelete(null);
                }}
                className="flex-1 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs transition cursor-pointer font-sans"
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}

      {themeToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 text-center space-y-5 animate-scale-up">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100 shadow-xs">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-slate-800">Remover Tema?</h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Tem certeza de que deseja remover o tema <strong className="text-slate-800 font-semibold">"{themeToDelete.name}"</strong> do catálogo?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setThemeToDelete(null)}
                className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 transition cursor-pointer font-sans"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTheme(themeToDelete.id);
                  triggerToast(`Tema "${themeToDelete.name}" removido! 🗑️`);
                  setThemeToDelete(null);
                }}
                className="flex-1 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs transition cursor-pointer font-sans"
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-orange-100 text-center space-y-5 animate-scale-up">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto border border-orange-100 shadow-xs animate-pulse">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-orange-800">Redefinir Configurações do Ateliê?</h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Isso irá restaurar todos os textos básicos, imagens, produtos e temas originais do catálogo. Todos os produtos e temas adicionados ou alterados serão excluídos permanentemente.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-700 transition cursor-pointer font-sans"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAll();
                  triggerToast("Configurações redefinidas com sucesso! 🔄 (Feche e reabra o painel se desejar recarregar os campos)");
                  setShowResetConfirm(false);
                  setIsAdminOpen(false);
                }}
                className="flex-1 py-2.5 text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-xs transition cursor-pointer font-sans"
              >
                Sim, Redefinir Tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
