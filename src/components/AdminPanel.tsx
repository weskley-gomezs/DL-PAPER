import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Plus,
  Trash2,
  Edit,
  RotateCcw,
  Instagram,
  MessageCircle,
  FileText,
  Package,
  Palette,
  Check,
  AlertCircle,
  Sparkles,
  PlusCircle,
  Lock,
  Key,
  LogOut,
  Image as ImageIcon,
  Upload,
  Loader2,
  Link2,
} from "lucide-react";
import { useAppContext } from "../context/DataContext";
import {
  Product,
  ProductSegment,
  ThemeItem,
  HeroBannerItem,
  TestimonialPrintItem,
} from "../types";
import { uploadSiteImage } from "../utils/imageUpload";
import { getSafeImageUrl } from "../lib/security";
import {
  saveProductToFirestore,
  deleteProductFromFirestore,
} from "../lib/siteFirestore";
import {
  clearProdutosSessionCache,
  useFirebaseProducts,
} from "../hooks/useFirebaseProducts";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface AdminThumbProps {
  src?: string;
  alt: string;
  contain?: boolean;
}

function AdminThumb({ src, alt, contain = false }: AdminThumbProps) {
  const [hasError, setHasError] = useState(false);
  const safeSrc = getSafeImageUrl(src);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!safeSrc || hasError) {
    return (
      <div className="aspect-square w-full rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-2 text-center">
        <ImageIcon className="w-7 h-7 opacity-60" />
        <span className="text-[11px] font-sans font-semibold">Sem foto</span>
      </div>
    );
  }

  return (
    <div className="aspect-square w-full rounded-xl bg-white border border-slate-200 overflow-hidden">
      <img
        src={safeSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full rounded-xl ${
          contain ? "object-contain p-2 bg-slate-50" : "object-cover"
        }`}
      />
    </div>
  );
}

interface ProductFormState {
  id?: string;
  name: string;
  segment: ProductSegment;
  precoVenda: number;
  description: string;
  image: string;
  exibirNoSite: boolean;
}

const INITIAL_PRODUCT_FORM: ProductFormState = {
  name: "",
  segment: "pessoal",
  precoVenda: 15,
  description: "",
  image: "",
  exibirNoSite: true,
};

export default function AdminPanel() {
  const {
    data,
    updateData,
    addTheme,
    updateTheme,
    deleteTheme,
    resetAll,
    isAdminOpen,
    setIsAdminOpen,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
  } = useAppContext();

  const {
    products: firestoreProducts,
    loading: loadingFirestoreProducts,
    errorMessage: productsErrorMessage,
    refreshProducts,
  } = useFirebaseProducts();

  const [activeTab, setActiveTab] = useState<
    "site" | "images" | "products" | "themes"
  >("site");

  // Login flow local state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newAdminUsername, setNewAdminUsername] = useState(
    data.adminUsername || "Danyelle"
  );
  const [newAdminPassword, setNewAdminPassword] = useState(
    data.adminPassword || "Danyelle@2026"
  );

  // Upload & Save status
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth.currentUser);
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsub();
  }, []);

  // Local state for General Settings
  const [logo, setLogo] = useState(data.logo);
  const [heroImage, setHeroImage] = useState(data.heroImage);
  const [heroVideo, setHeroVideo] = useState(
    data.heroVideo || "https://i.imgur.com/WMweeTZ.mp4"
  );
  const [aboutImage, setAboutImage] = useState(data.aboutImage);
  const [partyFavorsImage, setPartyFavorsImage] = useState(
    data.partyFavorsImage
  );
  const [whatsappNumber, setWhatsappNumber] = useState(data.whatsappNumber);
  const [whatsappFormatted, setWhatsappFormatted] = useState(
    data.whatsappFormatted
  );
  const [instagramHandle, setInstagramHandle] = useState(data.instagramHandle);
  const [instagramUrl, setInstagramUrl] = useState(data.instagramUrl);
  const [comingSoonTitle, setComingSoonTitle] = useState(
    data.comingSoonTitle || "Nosso Novo Catálogo Está Chegando!"
  );
  const [comingSoonSubtitle, setComingSoonSubtitle] = useState(
    data.comingSoonSubtitle || ""
  );

  // Site-wide images state
  const [heroBanners, setHeroBanners] = useState<HeroBannerItem[]>(
    data.heroBanners || []
  );
  const [testimonialPrints, setTestimonialPrints] = useState<
    TestimonialPrintItem[]
  >(data.testimonialPrints || []);
  const [kitGalleryFeminina, setKitGalleryFeminina] = useState<string[]>(
    data.kitGalleryFeminina || []
  );
  const [kitGalleryMasculina, setKitGalleryMasculina] = useState<string[]>(
    data.kitGalleryMasculina || []
  );

  // Local state for Hero Texts
  const [heroTag, setHeroTag] = useState(data.heroTexts.tag);
  const [heroTitlePrefix, setHeroTitlePrefix] = useState(
    data.heroTexts.titlePrefix
  );
  const [heroTitleColored, setHeroTitleColored] = useState(
    data.heroTexts.titleColored
  );
  const [heroSubtitle, setHeroSubtitle] = useState(data.heroTexts.subtitle);
  const [heroDescription, setHeroDescription] = useState(
    data.heroTexts.description
  );

  // Local state for About Texts
  const [aboutTag, setAboutTag] = useState(data.aboutTexts.tag);
  const [aboutTitle, setAboutTitle] = useState(data.aboutTexts.title);
  const [aboutParagraph1, setAboutParagraph1] = useState(
    data.aboutTexts.paragraph1
  );
  const [aboutParagraph2, setAboutParagraph2] = useState(
    data.aboutTexts.paragraph2
  );
  const [aboutParagraph3, setAboutParagraph3] = useState(
    data.aboutTexts.paragraph3 || ""
  );
  const [aboutFloatingText, setAboutFloatingText] = useState(
    data.aboutTexts.floatingText
  );

  // Product Editing state (backed by Firestore `produtos`)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [adminProductFilter, setAdminProductFilter] = useState<
    "todos" | "pessoal" | "corporativo"
  >("todos");
  const [productForm, setProductForm] =
    useState<ProductFormState>(INITIAL_PRODUCT_FORM);

  // Theme Editing state
  const [editingTheme, setEditingTheme] = useState<ThemeItem | null>(null);
  const [isAddingTheme, setIsAddingTheme] = useState(false);
  const [themeForm, setThemeForm] = useState<Omit<ThemeItem, "id">>({
    name: "",
    image: "",
    vibe: "",
    colors: [],
  });
  const [colorInput, setColorInput] = useState("");

  // Confirmation dialogs
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [themeToDelete, setThemeToDelete] = useState<ThemeItem | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const toastTimerRef = useRef<number | null>(null);
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
      setNewAdminUsername(data.adminUsername || "Danyelle");
      setNewAdminPassword(data.adminPassword || "Danyelle@2026");
      setComingSoonTitle(
        data.comingSoonTitle || "Nosso Novo Catálogo Está Chegando!"
      );
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
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage("");
    }, 3600);
  };

  const handleGoogleCloudConnect = async () => {
    setIsConnectingGoogle(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      triggerToast(
        `Nuvem Firebase conectada como ${cred.user.email || "Administrador"}!`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      triggerToast(`Não foi possível conectar o Google: ${msg}`);
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const handleGoogleCloudDisconnect = async () => {
    await signOut(auth);
    triggerToast("Conta Google desconectada da nuvem.");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (cleanUser === "admin" || cleanPass === "admin123") {
      setLoginError(
        "Credenciais inválidas. O acesso padrão antigo foi desativado."
      );
      return;
    }

    const rawStoredUser = (data.adminUsername || "").trim();
    const rawStoredPass = (data.adminPassword || "").trim();

    const storedUser = (
      rawStoredUser &&
      rawStoredUser.toLowerCase() !== "admin" &&
      rawStoredUser.toLowerCase() !== "danilau"
        ? rawStoredUser
        : "Danyelle"
    ).toLowerCase();

    const storedPass =
      rawStoredPass &&
      rawStoredPass !== "admin123" &&
      rawStoredPass !== "Dani@784512"
        ? rawStoredPass
        : "Danyelle@2026";

    if (cleanUser === storedUser && cleanPass === storedPass) {
      setIsAdminLoggedIn(true);
      setLoginError("");
      setUsernameInput("");
      setPasswordInput("");
      triggerToast("Acesso concedido com sucesso!");
    } else {
      setLoginError(
        "Usuário ou senha incorretos. Verifique suas credenciais de administrador."
      );
    }
  };

  /**
   * Faz redimensionamento + compressão (900px / 0.8), envia para Firebase Storage (site-imagens/)
   * e aplica fallback automático para Base64 caso o Storage retorne erro de permissão/CORS.
   */
  const handleImageFileUpload = async (
    uploadKey: string,
    file: File | undefined,
    folder: string,
    onUploaded: (
      finalUrl: string,
      source: "storage" | "base64"
    ) => Promise<void> | void,
    autoSaved = false
  ) => {
    if (!file) return;
    setUploadingKey(uploadKey);
    try {
      const result = await uploadSiteImage(file, folder);
      await onUploaded(result.url, result.source);

      if (!autoSaved) {
        triggerToast(
          result.source === "storage"
            ? "Foto enviada para o Firebase Storage! Clique em Salvar para gravar no site."
            : "Foto otimizada (modo Firestore)! Clique em Salvar para gravar definitivamente."
        );
      }
    } catch {
      triggerToast(
        "Não foi possível processar essa imagem. Tente outro arquivo JPG, PNG ou WebP."
      );
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSaveAllSiteImages = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateData({
        logo,
        heroImage,
        heroVideo,
        aboutImage,
        partyFavorsImage,
        heroBanners,
        testimonialPrints,
        kitGalleryFeminina,
        kitGalleryMasculina,
      });
      clearProdutosSessionCache();

      if (res.firestoreSaved) {
        triggerToast(
          "Todas as imagens foram salvas no Firestore e publicadas no site!"
        );
      } else {
        triggerToast(
          `Salvo no estado atual, mas houve aviso no Firestore: ${
            res.error || "verifique as regras do banco"
          }`
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedUser = newAdminUsername.trim();
    const sanitizedPass = newAdminPassword.trim();
    if (
      sanitizedUser.toLowerCase() === "admin" ||
      sanitizedPass === "admin123"
    ) {
      triggerToast(
        "Não é permitido usar 'admin' ou 'admin123' como acesso administrativo."
      );
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateData({
        logo,
        heroImage,
        heroVideo,
        aboutImage,
        partyFavorsImage,
        whatsappNumber,
        whatsappFormatted,
        instagramHandle,
        instagramUrl,
        adminUsername: sanitizedUser || "Danyelle",
        adminPassword: sanitizedPass || "Danyelle@2026",
        comingSoonTitle,
        comingSoonSubtitle,
        heroTexts: {
          tag: heroTag,
          titlePrefix: heroTitlePrefix,
          titleColored: heroTitleColored,
          subtitle: heroSubtitle,
          description: heroDescription,
        },
        aboutTexts: {
          tag: aboutTag,
          title: aboutTitle,
          paragraph1: aboutParagraph1,
          paragraph2: aboutParagraph2,
          paragraph3: aboutParagraph3,
          floatingText: aboutFloatingText,
        },
      });
      clearProdutosSessionCache();

      if (res.firestoreSaved) {
        triggerToast("Configurações salvas no Firestore com sucesso!");
      } else {
        triggerToast(
          `Salvo localmente; aviso do Firestore: ${
            res.error || "verifique a conexão"
          }`
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = productForm.name.trim();
    const price = Number(productForm.precoVenda);

    if (!cleanName) {
      triggerToast("Preencha o nome do produto.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      triggerToast("Informe um preço de venda positivo válido (maior que 0).");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveProductToFirestore({
        id: editingProduct?.id,
        nome: cleanName,
        precoVenda: price,
        categoriaLinha: productForm.segment,
        descricao: productForm.description,
        imagemUrl: productForm.image,
        exibirNoSite: productForm.exibirNoSite,
      });

      if (!res.ok) {
        triggerToast(
          `Não foi possível salvar no Firestore: ${
            res.error || "verifique as permissões"
          }`
        );
        return;
      }

      clearProdutosSessionCache();
      triggerToast(
        editingProduct
          ? `Produto "${cleanName}" salvo no Firestore!`
          : `Produto "${cleanName}" criado e publicado no catálogo!`
      );
      setEditingProduct(null);
      setIsAddingProduct(false);
      setProductForm(INITIAL_PRODUCT_FORM);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDirectProductPhotoUpload = async (
    prod: Product,
    file: File | undefined
  ) => {
    await handleImageFileUpload(
      `prod-${prod.id}`,
      file,
      "produtos",
      async (url) => {
        const res = await saveProductToFirestore({
          id: prod.id,
          nome: prod.name,
          precoVenda: prod.precoVenda ?? prod.minPrice,
          categoriaLinha: prod.segment || "pessoal",
          descricao: prod.description,
          imagemUrl: url,
          exibirNoSite: prod.exibirNoSite !== false,
        });
        if (!res.ok) {
          triggerToast(
            `Erro ao gravar foto no Firestore: ${
              res.error || "verifique as permissões"
            }`
          );
          return;
        }
        clearProdutosSessionCache();
        triggerToast(`Foto de "${prod.name}" atualizada no catálogo!`);
      },
      true
    );
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      id: prod.id,
      name: prod.name,
      segment: prod.segment || "pessoal",
      precoVenda: prod.precoVenda ?? prod.minPrice ?? 15,
      description: prod.description || "",
      image: prod.image || "",
      exibirNoSite: prod.exibirNoSite !== false,
    });
    setIsAddingProduct(false);
  };

  // Helper for theme color addition
  const addColorToForm = () => {
    if (colorInput.trim() && colorInput.startsWith("#")) {
      setThemeForm((prev) => ({
        ...prev,
        colors: [...prev.colors, colorInput.trim().toUpperCase()],
      }));
      setColorInput("");
    } else {
      triggerToast("A cor deve começar com # (exemplo: #FF6699).");
    }
  };

  const removeColorFromForm = (idx: number) => {
    setThemeForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx),
    }));
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!themeForm.name.trim() || !themeForm.image.trim()) {
      triggerToast("Preencha o nome do tema e envie uma imagem.");
      return;
    }

    setIsSaving(true);
    try {
      const res = editingTheme
        ? await updateTheme(editingTheme.id, themeForm)
        : await addTheme(themeForm);

      if (res.firestoreSaved) {
        triggerToast(
          editingTheme
            ? `Tema "${themeForm.name}" atualizado no Firestore!`
            : `Tema "${themeForm.name}" adicionado ao site!`
        );
      } else {
        triggerToast(
          `Tema atualizado localmente; aviso Firestore: ${res.error || ""}`
        );
      }

      setEditingTheme(null);
      setIsAddingTheme(false);
      setThemeForm({ name: "", image: "", vibe: "", colors: [] });
      setColorInput("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDirectThemePhotoUpload = async (
    them: ThemeItem,
    file: File | undefined
  ) => {
    await handleImageFileUpload(
      `theme-${them.id}`,
      file,
      "temas",
      async (url) => {
        const res = await updateTheme(them.id, { image: url });
        if (res.firestoreSaved) {
          triggerToast(`Foto do tema "${them.name}" salva no Firestore!`);
        } else {
          triggerToast(`Foto atualizada localmente (${res.error || "aviso"}).`);
        }
      },
      true
    );
  };

  const startEditTheme = (them: ThemeItem) => {
    setEditingTheme(them);
    setThemeForm({
      name: them.name,
      image: them.image,
      vibe: them.vibe,
      colors: them.colors,
    });
    setIsAddingTheme(false);
  };

  if (!isAdminOpen) return null;

  const filteredProducts = firestoreProducts.filter((prod) => {
    if (adminProductFilter === "todos") return true;
    if (adminProductFilter === "pessoal")
      return prod.segment === "pessoal" || prod.segment === "ambos" || !prod.segment;
    if (adminProductFilter === "corporativo")
      return prod.segment === "corporativo" || prod.segment === "ambos";
    return true;
  });

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      id="admin_overlay"
    >
      {!isAdminLoggedIn ? (
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100 p-6 sm:p-8 space-y-6 text-center"
          id="admin_login_container"
        >
          <button
            type="button"
            onClick={() => setIsAdminOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 cursor-pointer"
            aria-label="Fechar Login"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mx-auto w-16 h-16 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-brand-pink mt-4 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl font-extrabold text-slate-800">
              Acesso Restrito
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Identifique-se como Administrador para poder editar ou remover
              itens do catálogo.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold text-left flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                Usuário ADM
              </label>
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
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                Senha de Acesso
              </label>
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
              Acesso exclusivo para edição e gerenciamento do ateliê{" "}
              <strong>DL Magic Paper</strong>.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden relative border border-slate-100"
          id="admin_container"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold">
                  Painel do Administrador
                </h2>
                <p className="text-xs text-slate-300 font-sans">
                  Upload direto com otimização automática e salvamento no
                  Firebase
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsAdminLoggedIn(false);
                  triggerToast("Sessão encerrada com segurança!");
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500/30 text-red-300 text-xs font-semibold font-sans transition-all cursor-pointer"
                title="Sair da conta de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sair
              </button>
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white cursor-pointer"
                aria-label="Fechar Painel"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Toast */}
          {toastMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white border border-pink-400/30 px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 z-50 max-w-[90%]">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-sans text-xs sm:text-sm font-semibold">
                {toastMessage}
              </span>
            </div>
          )}

          {/* Cloud Auth Bar */}
          <div className="px-6 py-2.5 bg-slate-900/95 border-b border-slate-700/60 text-white flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  firebaseUser ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              {firebaseUser ? (
                <span className="text-slate-200">
                  Nuvem Firebase conectada:{" "}
                  <strong className="text-white">{firebaseUser.email}</strong>
                </span>
              ) : (
                <span className="text-amber-200">
                  Conecte sua conta Google autorizada para gravar imagens e
                  configurações no Firestore.
                </span>
              )}
            </div>

            {firebaseUser ? (
              <button
                type="button"
                onClick={() => void handleGoogleCloudDisconnect()}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold cursor-pointer transition-colors"
              >
                Desconectar Google
              </button>
            ) : (
              <button
                type="button"
                disabled={isConnectingGoogle}
                onClick={() => void handleGoogleCloudConnect()}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-60"
              >
                {isConnectingGoogle ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Key className="w-3.5 h-3.5" />
                )}
                <span>
                  {isConnectingGoogle
                    ? "Conectando..."
                    : "Conectar Google (Salvar no Firestore)"}
                </span>
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-200 bg-slate-50 px-6 flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-2 -mb-px pt-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("site");
                  setEditingProduct(null);
                  setIsAddingProduct(false);
                  setEditingTheme(null);
                  setIsAddingTheme(false);
                }}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all font-sans cursor-pointer whitespace-nowrap ${
                  activeTab === "site"
                    ? "border-brand-pink text-brand-pink font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <FileText className="w-4 h-4" />
                Apresentação &amp; Redes
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("images");
                  setEditingProduct(null);
                  setIsAddingProduct(false);
                  setEditingTheme(null);
                  setIsAddingTheme(false);
                }}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all font-sans cursor-pointer whitespace-nowrap ${
                  activeTab === "images"
                    ? "border-brand-pink text-brand-pink font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Imagens do Site
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("products");
                  setEditingProduct(null);
                  setIsAddingProduct(false);
                  setEditingTheme(null);
                  setIsAddingTheme(false);
                }}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all font-sans cursor-pointer whitespace-nowrap ${
                  activeTab === "products"
                    ? "border-brand-pink text-brand-pink font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Package className="w-4 h-4" />
                Produtos ({firestoreProducts.length})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("themes");
                  setEditingProduct(null);
                  setIsAddingProduct(false);
                  setEditingTheme(null);
                  setIsAddingTheme(false);
                }}
                className={`flex items-center gap-2 py-3.5 px-4 text-sm font-semibold border-b-2 transition-all font-sans cursor-pointer whitespace-nowrap ${
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
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-xs font-semibold font-sans transition-all cursor-pointer"
                title="Redefinir todo conteúdo para valores originais"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Redefinir Originais
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div
            className="flex-1 overflow-y-auto p-6 bg-slate-50/50"
            id="admin_scrollable_body"
          >
            {/* TAB 1: SITE PRESENTATION & SOCIAL CHANNELS */}
            {activeTab === "site" && (
              <form onSubmit={handleSaveGeneral} className="space-y-8 max-w-5xl">
                {/* Visibility / Em Breve Mode Card */}
                <div className="bg-white p-6 rounded-2xl border-2 border-brand-pink/25 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-5 rounded-full bg-brand-pink" />
                        Visibilidade para o Público (Modo &ldquo;Em Breve&rdquo;)
                      </h3>
                      <p className="text-xs text-slate-500 font-sans mt-1">
                        Quando ativado, visitantes comuns veem a página{" "}
                        <strong>&ldquo;Em Breve&rdquo;</strong>, enquanto você
                        (logada como admin) vê e edita o site completo
                        normalmente.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !data.isComingSoon;
                        void updateData({ isComingSoon: next });
                        triggerToast(
                          next
                            ? "Modo 'Em Breve' ativado para o público!"
                            : "Site publicado e visível para todos os clientes!"
                        );
                      }}
                      className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 border ${
                        data.isComingSoon
                          ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {data.isComingSoon
                          ? "Modo Em Breve: ATIVO"
                          : "Site PUBLICADO (Público)"}
                      </span>
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Título da Tela &ldquo;Em Breve&rdquo;
                      </label>
                      <input
                        type="text"
                        value={comingSoonTitle}
                        onChange={(e) => setComingSoonTitle(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Texto da Tela &ldquo;Em Breve&rdquo;
                      </label>
                      <input
                        type="text"
                        value={comingSoonSubtitle}
                        onChange={(e) => setComingSoonSubtitle(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Media Grid */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-5 rounded-full bg-brand-pink" />
                      Imagens Principais (Upload Direto)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("images")}
                      className="text-xs font-bold text-brand-pink hover:underline cursor-pointer"
                    >
                      Abrir Gerenciador Completo de Imagens →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        key: "site-logo",
                        label: "Logo do Ateliê",
                        val: logo,
                        setter: setLogo,
                        folder: "logo",
                        contain: true,
                      },
                      {
                        key: "site-hero",
                        label: "Banner Principal",
                        val: heroImage,
                        setter: setHeroImage,
                        folder: "banners",
                        contain: false,
                      },
                      {
                        key: "site-about",
                        label: "Foto Sobre Nós",
                        val: aboutImage,
                        setter: setAboutImage,
                        folder: "sobre",
                        contain: false,
                      },
                      {
                        key: "site-aux",
                        label: "Foto Auxiliar",
                        val: partyFavorsImage,
                        setter: setPartyFavorsImage,
                        folder: "geral",
                        contain: false,
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between gap-2.5"
                      >
                        <span className="text-xs font-bold text-slate-700 font-sans line-clamp-1">
                          {item.label}
                        </span>

                        <AdminThumb
                          src={item.val}
                          alt={item.label}
                          contain={item.contain}
                        />

                        <div className="flex items-center gap-1.5">
                          <label className="flex-1 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                            {uploadingKey === item.key ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Upload className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {uploadingKey === item.key
                                ? "Enviando..."
                                : "Alterar Foto"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                e.target.value = "";
                                void handleImageFileUpload(
                                  item.key,
                                  f,
                                  item.folder,
                                  (url) => item.setter(url)
                                );
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => item.setter("")}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold cursor-pointer"
                            title="Excluir foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                      Vídeo de Fundo do Topo (MP4 / Link direto)
                    </label>
                    <input
                      type="text"
                      value={heroVideo}
                      onChange={(e) => setHeroVideo(e.target.value)}
                      placeholder="https://... ou /hero_video.mp4"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                    />
                  </div>
                </div>

                {/* Hero Texts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-brand-tiffany" />
                    Textos do Cabeçalho (Hero)
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Tag / Chamada Rápida
                      </label>
                      <input
                        type="text"
                        value={heroTag}
                        onChange={(e) => setHeroTag(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Título Principal (Fixo)
                        </label>
                        <input
                          type="text"
                          value={heroTitlePrefix}
                          onChange={(e) => setHeroTitlePrefix(e.target.value)}
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Título Principal (Colorido)
                        </label>
                        <input
                          type="text"
                          value={heroTitleColored}
                          onChange={(e) => setHeroTitleColored(e.target.value)}
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Slogan / Citação Itálica
                      </label>
                      <input
                        type="text"
                        value={heroSubtitle}
                        onChange={(e) => setHeroSubtitle(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Descrição do Ateliê
                      </label>
                      <textarea
                        value={heroDescription}
                        onChange={(e) => setHeroDescription(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* About Texts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-brand-lilac" />
                    Nossa História (Histórico e Propósito)
                  </h3>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Tag (Ex: &ldquo;Nosso Sonho&rdquo;)
                        </label>
                        <input
                          type="text"
                          value={aboutTag}
                          onChange={(e) => setAboutTag(e.target.value)}
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Título Principal da Seção
                        </label>
                        <input
                          type="text"
                          value={aboutTitle}
                          onChange={(e) => setAboutTitle(e.target.value)}
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Parágrafo Narrativo 1
                      </label>
                      <textarea
                        value={aboutParagraph1}
                        onChange={(e) => setAboutParagraph1(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Parágrafo Narrativo 2
                      </label>
                      <textarea
                        value={aboutParagraph2}
                        onChange={(e) => setAboutParagraph2(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Parágrafo Narrativo 3
                      </label>
                      <textarea
                        value={aboutParagraph3}
                        onChange={(e) => setAboutParagraph3(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Selo / Texto Flutuante da Foto
                      </label>
                      <input
                        type="text"
                        value={aboutFloatingText}
                        onChange={(e) => setAboutFloatingText(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-indigo-900" />
                    Links Rápidos &amp; Atendimentos
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-emerald-500" />
                        WhatsApp Sem Símbolos (DDD + DDI)
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
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        WhatsApp Formatado (Exibição)
                      </label>
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
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Link Direto Instagram
                      </label>
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

                {/* Security / Admin password */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-5 rounded-full bg-red-500" />
                    Segurança do Painel (Acesso Administrativo)
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Usuário do Administrador
                      </label>
                      <input
                        type="text"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                        Nova Senha de Acesso
                      </label>
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2" id="general_save_block">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-8 py-3.5 rounded-xl font-bold font-sans shadow-lg shadow-brand-pink/20 hover:scale-101 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>
                      {isSaving ? "Salvando no Firebase..." : "Salvar Configurações"}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: SITE-WIDE IMAGES MANAGER */}
            {activeTab === "images" && (
              <form
                onSubmit={handleSaveAllSiteImages}
                className="space-y-8 max-w-5xl"
              >
                {/* Bloco 1: Identidade & Seções Principais */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-5 rounded-full bg-brand-pink" />
                      1. Identidade Visual &amp; Seções Principais
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Envie fotos direto do aparelho (redimensionamento e
                      compressão automáticos) e clique em Salvar abaixo.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        key: "img-logo",
                        label: "Logo do Ateliê",
                        val: logo,
                        setter: setLogo,
                        folder: "logo",
                        contain: true,
                      },
                      {
                        key: "img-hero",
                        label: "Banner Principal",
                        val: heroImage,
                        setter: setHeroImage,
                        folder: "banners",
                        contain: false,
                      },
                      {
                        key: "img-about",
                        label: "Foto Sobre Nós",
                        val: aboutImage,
                        setter: setAboutImage,
                        folder: "sobre",
                        contain: false,
                      },
                      {
                        key: "img-aux",
                        label: "Foto Auxiliar",
                        val: partyFavorsImage,
                        setter: setPartyFavorsImage,
                        folder: "geral",
                        contain: false,
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between gap-3"
                      >
                        <span className="text-xs font-bold text-slate-700 font-sans line-clamp-1">
                          {item.label}
                        </span>

                        <AdminThumb
                          src={item.val}
                          alt={item.label}
                          contain={item.contain}
                        />

                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <label className="flex-1 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                              {uploadingKey === item.key ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>
                                {uploadingKey === item.key
                                  ? "Enviando..."
                                  : "Alterar Foto"}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  void handleImageFileUpload(
                                    item.key,
                                    f,
                                    item.folder,
                                    (url) => item.setter(url)
                                  );
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => item.setter("")}
                              className="px-2.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              title="Excluir imagem"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Excluir</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
                            <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <input
                              type="text"
                              value={item.val.startsWith("data:") ? "" : item.val}
                              onChange={(e) => item.setter(e.target.value)}
                              placeholder={
                                item.val.startsWith("data:")
                                  ? "Imagem enviada (Firestore)"
                                  : "URL opcional"
                              }
                              className="w-full text-[11px] bg-transparent outline-hidden font-sans text-slate-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloco 2: Carrossel Mais Destaques do Ateliê */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-5 rounded-full bg-brand-tiffany" />
                        2. Banners do Carrossel (Hero)
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Fotos e legendas dos banners rotativos da página inicial.
                      </p>
                    </div>
                    <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold cursor-pointer transition-colors">
                      {uploadingKey === "banner-new" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      <span>Enviar Novo Banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          void handleImageFileUpload(
                            "banner-new",
                            f,
                            "banners",
                            (url) =>
                              setHeroBanners((prev) => [
                                ...prev,
                                {
                                  id: `banner-${Date.now()}`,
                                  src: url,
                                  title: "Novo Destaque DL Magic Paper",
                                  subtitle: "Personalizado com carinho e qualidade",
                                },
                              ])
                          );
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {heroBanners.map((banner, idx) => (
                      <div
                        key={banner.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between gap-3"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                          Banner #{idx + 1}
                        </span>

                        <AdminThumb src={banner.src} alt={banner.title} />

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={banner.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHeroBanners((prev) =>
                                prev.map((b, i) =>
                                  i === idx ? { ...b, title: val } : b
                                )
                              );
                            }}
                            placeholder="Título do banner"
                            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-sans font-semibold"
                          />
                          <input
                            type="text"
                            value={banner.subtitle}
                            onChange={(e) => {
                              const val = e.target.value;
                              setHeroBanners((prev) =>
                                prev.map((b, i) =>
                                  i === idx ? { ...b, subtitle: val } : b
                                )
                              );
                            }}
                            placeholder="Subtítulo"
                            className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-sans"
                          />

                          <div className="flex items-center gap-1.5">
                            <label className="flex-1 py-2 px-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                              {uploadingKey === `banner-${idx}` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Alterar Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  void handleImageFileUpload(
                                    `banner-${idx}`,
                                    f,
                                    "banners",
                                    (url) =>
                                      setHeroBanners((prev) =>
                                        prev.map((b, i) =>
                                          i === idx ? { ...b, src: url } : b
                                        )
                                      )
                                  );
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setHeroBanners((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                              className="px-2.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold cursor-pointer"
                              title="Excluir banner"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
                            <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <input
                              type="text"
                              value={banner.src.startsWith("data:") ? "" : banner.src}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHeroBanners((prev) =>
                                  prev.map((b, i) =>
                                    i === idx ? { ...b, src: val } : b
                                  )
                                );
                              }}
                              placeholder="URL opcional"
                              className="w-full text-[11px] bg-transparent outline-hidden font-sans text-slate-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloco 3: Prints de Avaliações Reais */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-5 rounded-full bg-emerald-500" />
                        3. Feedbacks / Prints do WhatsApp
                      </h3>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        Adicione ou troque os prints de feedbacks de clientes.
                      </p>
                    </div>
                    <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold cursor-pointer transition-colors">
                      {uploadingKey === "print-new" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      <span>Enviar Novo Print</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = "";
                          void handleImageFileUpload(
                            "print-new",
                            f,
                            "feedbacks",
                            (url) =>
                              setTestimonialPrints((prev) => [
                                ...prev,
                                {
                                  id: `screenshot-${Date.now()}`,
                                  url,
                                  alt: `Depoimento do WhatsApp de Cliente ${
                                    prev.length + 1
                                  }`,
                                },
                              ])
                          );
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {testimonialPrints.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between gap-3"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
                          Print #{idx + 1}
                        </span>

                        <AdminThumb src={item.url} alt={item.alt} />

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={item.alt}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTestimonialPrints((prev) =>
                                prev.map((p, i) =>
                                  i === idx ? { ...p, alt: val } : p
                                )
                              );
                            }}
                            placeholder="Descrição do depoimento"
                            className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-sans"
                          />

                          <div className="flex items-center gap-1.5">
                            <label className="flex-1 py-2 px-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                              {uploadingKey === `print-${idx}` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Alterar Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  void handleImageFileUpload(
                                    `print-${idx}`,
                                    f,
                                    "feedbacks",
                                    (url) =>
                                      setTestimonialPrints((prev) =>
                                        prev.map((p, i) =>
                                          i === idx ? { ...p, url } : p
                                        )
                                      )
                                  );
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setTestimonialPrints((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                              className="px-2.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold cursor-pointer"
                              title="Excluir print"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1">
                            <Link2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <input
                              type="text"
                              value={item.url.startsWith("data:") ? "" : item.url}
                              onChange={(e) => {
                                const val = e.target.value;
                                setTestimonialPrints((prev) =>
                                  prev.map((p, i) =>
                                    i === idx ? { ...p, url: val } : p
                                  )
                                );
                              }}
                              placeholder="URL opcional"
                              className="w-full text-[11px] bg-transparent outline-hidden font-sans text-slate-600"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bloco 4: Galerias Kit Festas Clássico */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2 h-5 rounded-full bg-brand-lilac" />
                      4. Galerias do &ldquo;Kit Festas Clássico&rdquo;
                    </h3>
                  </div>

                  {/* Coleção Feminina */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700 font-sans">
                        Coleção Feminina ({kitGalleryFeminina.length} fotos)
                      </span>
                      <label className="px-3.5 py-2 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                        {uploadingKey === "fem-new" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Adicionar Foto (Feminina)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            void handleImageFileUpload(
                              "fem-new",
                              f,
                              "kits-fem",
                              (url) =>
                                setKitGalleryFeminina((prev) => [...prev, url])
                            );
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {kitGalleryFeminina.map((url, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col gap-2.5"
                        >
                          <AdminThumb src={url} alt={`Feminina ${idx + 1}`} />
                          <div className="flex items-center gap-1.5">
                            <label className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                              <Upload className="w-3 h-3" />
                              <span>Alterar Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  void handleImageFileUpload(
                                    `fem-${idx}`,
                                    f,
                                    "kits-fem",
                                    (newUrl) =>
                                      setKitGalleryFeminina((prev) =>
                                        prev.map((u, i) =>
                                          i === idx ? newUrl : u
                                        )
                                      )
                                  );
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setKitGalleryFeminina((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFemininaUrl}
                        onChange={(e) => setNewFemininaUrl(e.target.value)}
                        placeholder="URL opcional para Coleção Feminina"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newFemininaUrl.trim()) {
                            setKitGalleryFeminina((prev) => [
                              ...prev,
                              newFemininaUrl.trim(),
                            ]);
                            setNewFemininaUrl("");
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                      >
                        Adicionar URL
                      </button>
                    </div>
                  </div>

                  {/* Coleção Masculina */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700 font-sans">
                        Coleção Masculina ({kitGalleryMasculina.length} fotos)
                      </span>
                      <label className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                        {uploadingKey === "masc-new" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Adicionar Foto (Masculina)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            e.target.value = "";
                            void handleImageFileUpload(
                              "masc-new",
                              f,
                              "kits-masc",
                              (url) =>
                                setKitGalleryMasculina((prev) => [...prev, url])
                            );
                          }}
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {kitGalleryMasculina.map((url, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col gap-2.5"
                        >
                          <AdminThumb src={url} alt={`Masculina ${idx + 1}`} />
                          <div className="flex items-center gap-1.5">
                            <label className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors">
                              <Upload className="w-3 h-3" />
                              <span>Alterar Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  void handleImageFileUpload(
                                    `masc-${idx}`,
                                    f,
                                    "kits-masc",
                                    (newUrl) =>
                                      setKitGalleryMasculina((prev) =>
                                        prev.map((u, i) =>
                                          i === idx ? newUrl : u
                                        )
                                      )
                                  );
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setKitGalleryMasculina((prev) =>
                                  prev.filter((_, i) => i !== idx)
                                )
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold cursor-pointer"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMasculinaUrl}
                        onChange={(e) => setNewMasculinaUrl(e.target.value)}
                        placeholder="URL opcional para Coleção Masculina"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newMasculinaUrl.trim()) {
                            setKitGalleryMasculina((prev) => [
                              ...prev,
                              newMasculinaUrl.trim(),
                            ]);
                            setNewMasculinaUrl("");
                          }
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                      >
                        Adicionar URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sticky / Bottom Save CTA */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving || Boolean(uploadingKey)}
                    className="flex items-center gap-2 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-8 py-3.5 rounded-xl font-bold font-sans shadow-lg shadow-brand-pink/20 hover:scale-101 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span>
                      {isSaving
                        ? "Salvando no Firestore..."
                        : "Salvar Todas as Imagens do Site"}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: PRODUCTS MANAGER (FIRESTORE) */}
            {activeTab === "products" && (
              <div className="space-y-6 max-w-5xl">
                {isAddingProduct || editingProduct ? (
                  <form
                    onSubmit={handleSaveProduct}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 max-w-3xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2.5 h-6 rounded-full bg-brand-pink" />
                        {editingProduct
                          ? `Editar Produto: ${editingProduct.name}`
                          : "Novo Produto no Catálogo"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsAddingProduct(false);
                        }}
                        className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-sans font-semibold cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Nome do Produto *
                        </label>
                        <input
                          type="text"
                          required
                          value={productForm.name}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Ex: Caixa Milk Personalizada Luxo"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Segmento no Catálogo *
                        </label>
                        <select
                          value={productForm.segment}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              segment: e.target.value as ProductSegment,
                            }))
                          }
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans font-semibold text-slate-800"
                        >
                          <option value="pessoal">
                            Pessoal (Festas e Aniversários)
                          </option>
                          <option value="corporativo">
                            Corporativo (Brindes e Empresas)
                          </option>
                          <option value="ambos">
                            Ambos (Festas &amp; Corporativo)
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Preço de Venda (R$) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          value={productForm.precoVenda}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              precoVenda: Number(e.target.value),
                            }))
                          }
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans font-bold"
                        />
                      </div>

                      {/* Foto principal com upload real + preview */}
                      <div className="md:col-span-2 p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                        <label className="block text-xs font-bold text-slate-700 font-sans">
                          Foto do Produto (Upload do Aparelho)
                        </label>

                        <div className="grid sm:grid-cols-[160px_1fr] gap-4 items-center">
                          <div className="w-40 mx-auto sm:mx-0">
                            <AdminThumb
                              src={productForm.image}
                              alt={productForm.name || "Preview do produto"}
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                                {uploadingKey === "prod-form" ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Upload className="w-4 h-4" />
                                )}
                                <span>
                                  {uploadingKey === "prod-form"
                                    ? "Otimizando e enviando..."
                                    : productForm.image
                                    ? "Alterar Foto"
                                    : "Enviar Foto"}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    e.target.value = "";
                                    void handleImageFileUpload(
                                      "prod-form",
                                      f,
                                      "produtos",
                                      (url) =>
                                        setProductForm((prev) => ({
                                          ...prev,
                                          image: url,
                                        }))
                                    );
                                  }}
                                />
                              </label>

                              {productForm.image && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setProductForm((prev) => ({
                                      ...prev,
                                      image: "",
                                    }))
                                  }
                                  className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Excluir Foto
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2">
                              <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <input
                                type="text"
                                value={
                                  productForm.image.startsWith("data:")
                                    ? ""
                                    : productForm.image
                                }
                                onChange={(e) =>
                                  setProductForm((prev) => ({
                                    ...prev,
                                    image: e.target.value,
                                  }))
                                }
                                placeholder={
                                  productForm.image.startsWith("data:")
                                    ? "Imagem otimizada salva para Firestore"
                                    : "URL opcional da imagem (https://...)"
                                }
                                className="w-full text-xs bg-transparent outline-hidden font-sans text-slate-700"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Descrição do Produto
                        </label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Descreva os detalhes, papéis e acabamentos."
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 min-h-[80px] font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsAddingProduct(false);
                        }}
                        className="px-5 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold font-sans text-sm text-slate-700 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving || Boolean(uploadingKey)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-6 py-2.5 rounded-xl font-bold font-sans text-sm shadow-md cursor-pointer disabled:opacity-60"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>
                          {isSaving
                            ? "Salvando..."
                            : editingProduct
                            ? "Salvar Alterações"
                            : "Salvar Produto"}
                        </span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-slate-800">
                          Catálogo de Produtos (Firestore)
                        </h4>
                        <p className="text-xs text-slate-500 font-sans">
                          Altere fotos diretamente nos cards ou adicione novos
                          itens com salvamento automático no banco.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={refreshProducts}
                          className="px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-brand-pink text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Atualizar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingProduct(true);
                            setEditingProduct(null);
                            setProductForm(INITIAL_PRODUCT_FORM);
                          }}
                          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Novo Produto
                        </button>
                      </div>
                    </div>

                    {/* Segment Filter */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="text-xs text-slate-500 font-semibold font-sans">
                        Filtrar por:
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdminProductFilter("todos")}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          adminProductFilter === "todos"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Todos ({firestoreProducts.length})
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
                        Pessoais (
                        {
                          firestoreProducts.filter(
                            (p) =>
                              p.segment === "pessoal" ||
                              p.segment === "ambos" ||
                              !p.segment
                          ).length
                        }
                        )
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
                        Corporativos (
                        {
                          firestoreProducts.filter(
                            (p) =>
                              p.segment === "corporativo" ||
                              p.segment === "ambos"
                          ).length
                        }
                        )
                      </button>
                    </div>

                    {productsErrorMessage && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-sans">
                        Aviso ao ler produtos do Firestore: {productsErrorMessage}
                      </div>
                    )}

                    {loadingFirestoreProducts ? (
                      <div className="py-12 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin text-brand-pink" />
                        <span>Carregando produtos do Firestore...</span>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                        <p className="font-serif text-base font-bold text-slate-700">
                          Nenhum produto encontrado nesta lista.
                        </p>
                        <p className="text-xs text-slate-400 font-sans">
                          Clique em &ldquo;Novo Produto&rdquo; para cadastrar um
                          item diretamente no Firestore.
                        </p>
                      </div>
                    ) : (
                      <div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        id="admin_products_grid"
                      >
                        {filteredProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 flex flex-col justify-between gap-3"
                          >
                            <div className="space-y-2.5">
                              <div className="relative">
                                <AdminThumb src={prod.image} alt={prod.name} />
                                <span
                                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-sans shadow-xs ${
                                    prod.segment === "corporativo"
                                      ? "bg-purple-700 text-white"
                                      : prod.segment === "ambos"
                                      ? "bg-amber-500 text-white"
                                      : "bg-[#E8527A] text-white"
                                  }`}
                                >
                                  {prod.segment === "corporativo"
                                    ? "Corporativo"
                                    : prod.segment === "ambos"
                                    ? "Ambos"
                                    : "Pessoal"}
                                </span>
                              </div>

                              <div>
                                <h5 className="font-serif font-bold text-sm text-slate-800 line-clamp-1">
                                  {prod.name}
                                </h5>
                                <div className="text-xs font-extrabold text-brand-pink mt-0.5 font-sans">
                                  R${" "}
                                  {(prod.precoVenda ?? prod.minPrice ?? 0)
                                    .toFixed(2)
                                    .replace(".", ",")}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-slate-100">
                              <label className="w-full py-1.5 px-2.5 bg-slate-900 hover:bg-brand-pink text-white rounded-xl text-[11px] font-bold font-sans flex items-center justify-center gap-1 transition-colors cursor-pointer">
                                {uploadingKey === `prod-${prod.id}` ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {uploadingKey === `prod-${prod.id}`
                                    ? "Salvando..."
                                    : "Alterar Foto"}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    e.target.value = "";
                                    void handleDirectProductPhotoUpload(prod, f);
                                  }}
                                />
                              </label>

                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => startEditProduct(prod)}
                                  className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold font-sans flex items-center justify-center gap-1 transition cursor-pointer"
                                >
                                  <Edit className="w-3 h-3" />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setProductToDelete(prod)}
                                  className="flex-1 py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[11px] font-bold font-sans flex items-center justify-center gap-1 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Excluir
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: THEMES MANAGER */}
            {activeTab === "themes" && (
              <div className="space-y-6 max-w-5xl">
                {isAddingTheme || editingTheme ? (
                  <form
                    onSubmit={handleSaveTheme}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-2.5 h-6 rounded-full bg-brand-pink" />
                        {editingTheme
                          ? `Editar Tema: ${editingTheme.name}`
                          : "Adicionar Novo Tema Festivo"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTheme(null);
                          setIsAddingTheme(false);
                        }}
                        className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-sans cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Nome do Tema
                        </label>
                        <input
                          type="text"
                          required
                          value={themeForm.name}
                          onChange={(e) =>
                            setThemeForm({ ...themeForm, name: e.target.value })
                          }
                          placeholder="Ex: Sonic, Minnie Vermelha, Fazendinha"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 font-sans">
                          Estilo / Vibe do Tema
                        </label>
                        <input
                          type="text"
                          required
                          value={themeForm.vibe}
                          onChange={(e) =>
                            setThemeForm({
                              ...themeForm,
                              vibe: e.target.value.toUpperCase(),
                            })
                          }
                          placeholder="Ex: TROPICAL, ALEGRE E SUPER FOFO"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-slate-50 font-sans"
                        />
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                        <label className="block text-xs font-bold text-slate-700 font-sans">
                          Foto do Tema (Upload do Aparelho)
                        </label>
                        <div className="grid sm:grid-cols-[140px_1fr] gap-4 items-center">
                          <div className="w-36 mx-auto sm:mx-0">
                            <AdminThumb
                              src={themeForm.image}
                              alt={themeForm.name || "Preview tema"}
                            />
                          </div>
                          <div className="space-y-2.5">
                            <div className="flex flex-wrap gap-2">
                              <label className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-pink text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                                {uploadingKey === "theme-form" ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Upload className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {uploadingKey === "theme-form"
                                    ? "Enviando..."
                                    : themeForm.image
                                    ? "Alterar Foto"
                                    : "Enviar Foto"}
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    e.target.value = "";
                                    void handleImageFileUpload(
                                      "theme-form",
                                      f,
                                      "temas",
                                      (url) =>
                                        setThemeForm((prev) => ({
                                          ...prev,
                                          image: url,
                                        }))
                                    );
                                  }}
                                />
                              </label>
                              {themeForm.image && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setThemeForm((prev) => ({
                                      ...prev,
                                      image: "",
                                    }))
                                  }
                                  className="px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Excluir
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-2">
                              <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <input
                                type="text"
                                value={
                                  themeForm.image.startsWith("data:")
                                    ? ""
                                    : themeForm.image
                                }
                                onChange={(e) =>
                                  setThemeForm({
                                    ...themeForm,
                                    image: e.target.value,
                                  })
                                }
                                placeholder="URL opcional da foto"
                                className="w-full text-xs bg-transparent outline-hidden font-sans"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-3">
                        <label className="block text-xs font-bold text-slate-700 font-sans">
                          Paleta de Cores do Tema
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={colorInput}
                            onChange={(e) => setColorInput(e.target.value)}
                            placeholder="Ex: #FF6699"
                            className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:border-brand-pink outline-hidden bg-white uppercase font-sans"
                          />
                          <button
                            type="button"
                            onClick={addColorToForm}
                            className="px-4 py-2 bg-slate-800 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition cursor-pointer"
                          >
                            Adicionar Cor
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                          {themeForm.colors.map((color, idx) => (
                            <span
                              key={idx}
                              style={{ borderColor: color }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full text-xs text-slate-800 font-semibold font-sans shadow-2xs"
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-200 shrink-0"
                                style={{ backgroundColor: color }}
                              />
                              {color}
                              <button
                                type="button"
                                onClick={() => removeColorFromForm(idx)}
                                className="text-red-500 font-bold pl-1 cursor-pointer"
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
                        className="px-5 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold font-sans text-sm text-slate-700 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSaving || Boolean(uploadingKey)}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-brand-pink to-brand-pink-hover text-white px-6 py-2.5 rounded-xl font-bold font-sans text-sm shadow-md cursor-pointer disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        {editingTheme ? "Salvar Alterações" : "Criar Tema"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-slate-800">
                          Galeria de Temas Ativos
                        </h4>
                        <p className="text-xs text-slate-500 font-sans">
                          Troque fotos diretamente nos cards ou crie novos temas.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingTheme(true);
                          setEditingTheme(null);
                          setThemeForm({
                            name: "",
                            image: "",
                            vibe: "",
                            colors: [],
                          });
                        }}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Novo Tema
                      </button>
                    </div>

                    <div
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                      id="admin_themes_grid"
                    >
                      {data.themes.map((them) => (
                        <div
                          key={them.id}
                          className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 flex flex-col justify-between gap-3"
                        >
                          <div className="space-y-2.5">
                            <AdminThumb src={them.image} alt={them.name} />

                            <div>
                              <h5 className="font-serif font-bold text-sm text-slate-800 line-clamp-1">
                                {them.name}
                              </h5>
                              <p className="text-[10px] font-sans font-extrabold text-brand-pink tracking-wider mt-0.5 line-clamp-1">
                                {them.vibe}
                              </p>

                              <div className="flex gap-1.5 mt-2">
                                {them.colors.map((color, i) => (
                                  <span
                                    key={i}
                                    className="w-4 h-4 rounded-full border border-slate-200 shadow-2xs"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-100">
                            <label className="w-full py-1.5 px-2.5 bg-slate-900 hover:bg-brand-pink text-white rounded-xl text-[11px] font-bold font-sans flex items-center justify-center gap-1 transition-colors cursor-pointer">
                              {uploadingKey === `theme-${them.id}` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Upload className="w-3.5 h-3.5" />
                              )}
                              <span>Alterar Foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  void handleDirectThemePhotoUpload(them, f);
                                }}
                              />
                            </label>

                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() => startEditTheme(them)}
                                className="flex-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold font-sans flex items-center justify-center gap-1 transition cursor-pointer"
                              >
                                <Edit className="w-3 h-3" />
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => setThemeToDelete(them)}
                                className="flex-1 py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[11px] font-bold font-sans flex items-center justify-center gap-1 transition cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                Excluir
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
            <span>
              Após enviar novas imagens, clique em Salvar antes de fechar no
              &ldquo;X&rdquo; para gravar definitivamente no Firestore.
            </span>
            <span className="font-bold text-slate-500 uppercase tracking-wide">
              DL Magic Paper Studio &copy; 2026
            </span>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 text-center space-y-5">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-slate-800">
                Excluir Produto?
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Tem certeza que deseja excluir{" "}
                <strong className="text-slate-800 font-semibold">
                  &ldquo;{productToDelete.name}&rdquo;
                </strong>{" "}
                do catálogo no Firestore?
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
                onClick={async () => {
                  const target = productToDelete;
                  setProductToDelete(null);
                  const res = await deleteProductFromFirestore(target.id);
                  if (!res.ok) {
                    triggerToast(
                      `Erro ao excluir no Firestore: ${res.error || ""}`
                    );
                    return;
                  }
                  clearProdutosSessionCache();
                  triggerToast(`Produto "${target.name}" excluído!`);
                }}
                className="flex-1 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs transition cursor-pointer font-sans"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Theme Confirmation Modal */}
      {themeToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 text-center space-y-5">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-slate-800">
                Excluir Tema?
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Tem certeza de que deseja remover o tema{" "}
                <strong className="text-slate-800 font-semibold">
                  &ldquo;{themeToDelete.name}&rdquo;
                </strong>{" "}
                do catálogo?
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
                onClick={async () => {
                  const target = themeToDelete;
                  setThemeToDelete(null);
                  await deleteTheme(target.id);
                  triggerToast(`Tema "${target.name}" excluído!`);
                }}
                className="flex-1 py-2.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs transition cursor-pointer font-sans"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-orange-100 text-center space-y-5">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto border border-orange-100">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-orange-800">
                Redefinir Configurações do Ateliê?
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Isso irá restaurar textos, banners, feedbacks e temas padrão do
                site.
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
                  triggerToast("Configurações redefinidas com sucesso!");
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
