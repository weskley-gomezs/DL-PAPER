import React, { useState } from "react";
import { 
  X, Save, Plus, Trash2, Edit, RotateCcw, 
  Instagram, MessageCircle, FileText, Layers, 
  Package, Palette, Check, AlertCircle, Sparkles, PlusCircle,
  Lock, Key, LogOut
} from "lucide-react";
import { useAppContext } from "../context/DataContext";
import { Product, ThemeItem } from "../types";

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

  const [activeTab, setActiveTab] = useState<"site" | "products" | "themes">("site");
  
  // Login flow local state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newAdminUsername, setNewAdminUsername] = useState(data.adminUsername || "Danilau");
  const [newAdminPassword, setNewAdminPassword] = useState(data.adminPassword || "Dani@784512");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctUser = (data.adminUsername || "Danilau").trim().toLowerCase();
    const correctPassword = data.adminPassword || "Dani@784512";

    if (usernameInput.trim().toLowerCase() === correctUser && passwordInput === correctPassword) {
      setIsAdminLoggedIn(true);
      setLoginError("");
      setUsernameInput("");
      setPasswordInput("");
      triggerToast("Acesso concedido com sucesso! 🛡️");
    } else {
      setLoginError("Usuário ou senha incorretos. Tente novamente!");
    }
  };

  // Local state for General Settings
  const [logo, setLogo] = useState(data.logo);
  const [heroImage, setHeroImage] = useState(data.heroImage);
  const [aboutImage, setAboutImage] = useState(data.aboutImage);
  const [partyFavorsImage, setPartyFavorsImage] = useState(data.partyFavorsImage);
  const [whatsappNumber, setWhatsappNumber] = useState(data.whatsappNumber);
  const [whatsappFormatted, setWhatsappFormatted] = useState(data.whatsappFormatted);
  const [instagramHandle, setInstagramHandle] = useState(data.instagramHandle);
  const [instagramUrl, setInstagramUrl] = useState(data.instagramUrl);

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
  const [productForm, setProductForm] = useState<Omit<Product, "id">>({
    name: "",
    category: "Topos de Bolo",
    minPrice: 10,
    maxPrice: 20,
    description: "",
    image: "",
    badge: "",
    features: []
  });
  const [featureInput, setFeatureInput] = useState("");

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

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  if (!isAdminOpen) return null;

  // Handle generalized save settings
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({
      logo,
      heroImage,
      aboutImage,
      partyFavorsImage,
      whatsappNumber,
      whatsappFormatted,
      instagramHandle,
      instagramUrl,
      adminUsername: newAdminUsername,
      adminPassword: newAdminPassword,
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
      badge: "",
      features: []
    });
    setFeatureInput("");
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      minPrice: prod.minPrice,
      maxPrice: prod.maxPrice,
      description: prod.description,
      image: prod.image,
      badge: prod.badge || "",
      features: prod.features || []
    });
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
              
              {/* Media links card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-brand-pink" />
                  Imagens Principais (Links)
                </h3>
                <p className="text-xs text-slate-400 mb-2 font-sans">
                  Insira links das imagens desejadas (hospedadas no Imgur, PostImg, Pinterest ou similares). Elas se atualizarão instantaneamente no catálogo!
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Logo do Ateliê (Sem fundo)</label>
                    <input 
                      type="text" 
                      value={logo} 
                      onChange={(e) => setLogo(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Banner do Hero (Topo do site)</label>
                    <input 
                      type="text" 
                      value={heroImage} 
                      onChange={(e) => setHeroImage(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Foto Sobre Nós (Nossa História)</label>
                    <input 
                      type="text" 
                      value={aboutImage} 
                      onChange={(e) => setAboutImage(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Foto Lateral Kit Luxo</label>
                    <input 
                      type="text" 
                      value={partyFavorsImage} 
                      onChange={(e) => setPartyFavorsImage(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                </div>

                {/* Previews grids */}
                <div className="pt-2 grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Logo</span>
                    <img src={logo} alt="Preview" className="w-12 h-12 object-contain bg-slate-100 rounded-lg p-1 border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Sem+Foto'; }} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Hero</span>
                    <img src={heroImage} alt="Preview" className="w-12 h-12 object-cover bg-slate-100 rounded-lg border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Sem+Foto'; }} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Sobre</span>
                    <img src={aboutImage} alt="Preview" className="w-12 h-12 object-cover bg-slate-100 rounded-lg border border-slate-200" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Sem+Foto'; }} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 font-sans">Kit Luxo</span>
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

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Link da Imagem</label>
                      <input
                        type="text"
                        required
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        placeholder="https://imgur.com/link-da-imagem.png"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
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
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-slate-800">Catálogo de Produtos</h4>
                      <p className="text-xs text-slate-500 font-sans">Cadastre, remova ou altere os preços e fotos dos produtos da vitrine.</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddingProduct(true);
                        setEditingProduct(null);
                        setProductForm({
                          name: "",
                          category: "Topos de Bolo",
                          minPrice: 10,
                          maxPrice: 20,
                          description: "",
                          image: "",
                          badge: "",
                          features: []
                        });
                      }}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Novo Produto
                    </button>
                  </div>

                  {/* Grid of Product Cards for editing */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4" id="admin_products_grid">
                    {data.products.map((prod) => (
                      <div key={prod.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden relative group/item">
                        
                        {/* Img backdrop */}
                        <div className="h-32 bg-slate-100 relative overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x150?text=Indisponivel'; }}
                          />
                          <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider font-sans">
                            {prod.category}
                          </span>

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

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">Link da Foto (De Decoração ou Amostra)</label>
                      <input
                        type="text"
                        required
                        value={themeForm.image}
                        onChange={(e) => setThemeForm({...themeForm, image: e.target.value})}
                        placeholder="https://imgur.com/link-do-tema.png"
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
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
                  triggerToast("Configurações redefinidas com sucesso! 🔄");
                  setShowResetConfirm(false);
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
