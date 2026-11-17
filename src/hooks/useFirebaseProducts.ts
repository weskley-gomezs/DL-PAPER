import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import {
  db,
  DL_SISTEMA_DATABASE_ID,
  firebaseConfig,
  handleFirestoreError,
  OperationType,
} from "../lib/firebase";
import {
  isSafeImageSource,
  isValidPositivePrice,
  sanitizePlainText,
} from "../lib/security";
import { Product, ProductSegment } from "../types";

const SESSION_CACHE_KEY = "dl_magic_paper_produtos_cache_v2";
const LAST_FETCH_KEY = "dl_magic_paper_produtos_last_fetch_v2";
const PRODUTOS_UPDATED_EVENT = "dl_magic_paper_produtos_updated";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos
const FETCH_COOLDOWN_MS = 15 * 1000; // Rate limit cliente mínimo entre consultas (15s)
const FIRESTORE_TIMEOUT_MS = 12000; // Evita loading infinito

export function clearProdutosSessionCache(): void {
  try {
    window.sessionStorage.removeItem(SESSION_CACHE_KEY);
    window.sessionStorage.removeItem(LAST_FETCH_KEY);
  } catch {
    // ignore
  }
}

export function notifyProdutosUpdated(): void {
  clearProdutosSessionCache();
  try {
    window.dispatchEvent(new CustomEvent(PRODUTOS_UPDATED_EVENT));
  } catch {
    // ignore
  }
}

export const MAX_PRODUCT_NAME_LENGTH = 90;
export const MAX_PRODUCT_DESCRIPTION_LENGTH = 280;

const DEFAULT_DESCRIPTION =
  "Papelaria personalizada artesanal com acabamento premium feita em Brasília - DF.";

export interface FirestoreProdutoRaw {
  nome?: unknown;
  precoVenda?: unknown;
  categoriaLinha?: unknown;
  descricao?: unknown;
  imagemUrl?: unknown;
  exibirNoSite?: unknown;
}

interface CachedProductsPayload {
  timestamp: number;
  products: Product[];
}

// Compartilha requisição em andamento para impedir loops / chamadas simultâneas duplicadas
let inFlightProdutosPromise: Promise<Product[]> | null = null;

function normalizeSegment(value: unknown): ProductSegment {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (
    normalized === "corporativo" ||
    normalized === "empresa" ||
    normalized === "empresas"
  ) {
    return "corporativo";
  }
  if (normalized === "ambos" || normalized === "todos") {
    return "ambos";
  }
  return "pessoal";
}

function getCategoryLabel(segment: ProductSegment): string {
  if (segment === "corporativo") return "Linha Corporativa";
  if (segment === "ambos") return "Festa & Corporativo";
  return "Linha Festa";
}

function buildSanitizedProduct(params: {
  id: string;
  nome: unknown;
  precoVenda: unknown;
  segment: unknown;
  descricao: unknown;
  imagemUrl: unknown;
  exibirNoSite: unknown;
}): Product | null {
  // Bloqueia produtos ocultos ou com preço inválido / não positivo
  if (params.exibirNoSite === false) {
    return null;
  }
  if (!isValidPositivePrice(params.precoVenda)) {
    return null;
  }

  const safeId = sanitizePlainText(params.id, 120);
  if (!safeId) {
    return null;
  }

  const segment = normalizeSegment(params.segment);
  const nome = sanitizePlainText(
    params.nome,
    MAX_PRODUCT_NAME_LENGTH,
    "Produto Personalizado"
  );
  const descricao = sanitizePlainText(
    params.descricao,
    MAX_PRODUCT_DESCRIPTION_LENGTH,
    DEFAULT_DESCRIPTION
  );
  // Aceita URL https:// ou fallback seguro Base64 raster comprimido (bloqueando javascript:/svg/html)
  const imagemUrl = isSafeImageSource(params.imagemUrl, false);

  return {
    id: safeId,
    name: nome,
    category: getCategoryLabel(segment),
    segment,
    minPrice: params.precoVenda,
    maxPrice: params.precoVenda,
    precoVenda: params.precoVenda,
    description: descricao,
    image: imagemUrl,
    exibirNoSite: true,
    features: [
      "Produção artesanal DL Magic Paper",
      "Personalizado com sua identidade ou tema",
      "Atendimento direto em Brasília - DF",
    ],
  };
}

function mapDocToProduct(
  docSnap: QueryDocumentSnapshot<DocumentData>
): Product | null {
  const raw = docSnap.data() as FirestoreProdutoRaw;
  return buildSanitizedProduct({
    id: docSnap.id,
    nome: raw.nome,
    precoVenda: raw.precoVenda,
    segment: raw.categoriaLinha,
    descricao: raw.descricao,
    imagemUrl: raw.imagemUrl,
    exibirNoSite: raw.exibirNoSite,
  });
}

function readLastFetchTimestamp(): number {
  try {
    const raw = window.sessionStorage.getItem(LAST_FETCH_KEY);
    if (!raw) return 0;
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeLastFetchTimestamp(ts: number): void {
  try {
    window.sessionStorage.setItem(LAST_FETCH_KEY, String(ts));
  } catch {
    // Ignora falha de quota do sessionStorage
  }
}

function readValidCache(): Product[] | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CachedProductsPayload;
    if (
      !parsed ||
      typeof parsed.timestamp !== "number" ||
      !Array.isArray(parsed.products)
    ) {
      return null;
    }

    const isFresh = Date.now() - parsed.timestamp < CACHE_TTL_MS;
    if (!isFresh) {
      window.sessionStorage.removeItem(SESSION_CACHE_KEY);
      return null;
    }

    // Revalida e sanitiza todos os itens do cache antes de renderizar
    return parsed.products
      .map((item) =>
        buildSanitizedProduct({
          id: item.id,
          nome: item.name,
          precoVenda: item.precoVenda ?? item.minPrice,
          segment: item.segment,
          descricao: item.description,
          imagemUrl: item.image,
          exibirNoSite: item.exibirNoSite,
        })
      )
      .filter((item): item is Product => item !== null);
  } catch {
    return null;
  }
}

function writeCache(products: Product[]): void {
  try {
    const payload: CachedProductsPayload = {
      timestamp: Date.now(),
      products,
    };
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignora falha de quota do sessionStorage
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error(`Tempo limite excedido ao consultar ${label}.`));
    }, ms);

    promise
      .then((res) => {
        window.clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        window.clearTimeout(timer);
        reject(err);
      });
  });
}

async function fetchProdutosFromFirestore(): Promise<Product[]> {
  if (inFlightProdutosPromise) {
    return inFlightProdutosPromise;
  }

  inFlightProdutosPromise = (async () => {
    if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
      throw new Error(
        "Configuração do Firebase incompleta: verifique apiKey e appId para o projeto dl-sistema-6eee9."
      );
    }

    writeLastFetchTimestamp(Date.now());

    const snapshot = await withTimeout(
      getDocs(collection(db, "produtos")),
      FIRESTORE_TIMEOUT_MS,
      `produtos (${DL_SISTEMA_DATABASE_ID})`
    );

    const loadedProducts = snapshot.docs
      .map(mapDocToProduct)
      .filter((item): item is Product => item !== null)
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    writeCache(loadedProducts);
    return loadedProducts;
  })().finally(() => {
    inFlightProdutosPromise = null;
  });

  return inFlightProdutosPromise;
}

export interface UseFirebaseProductsResult {
  products: Product[];
  loading: boolean;
  fromCache: boolean;
  permissionError: boolean;
  errorMessage: string | null;
  rateLimited: boolean;
  refreshProducts: () => void;
}

export function useFirebaseProducts(): UseFirebaseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);
  const [rateLimited, setRateLimited] = useState<boolean>(false);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const refreshProducts = useCallback((bypassCooldown?: unknown) => {
    // Rate limit de cliente: bloqueia rajadas manuais, mas permite reload imediato após edição no ADM
    const forceBypass = bypassCooldown === true;
    const lastFetch = readLastFetchTimestamp();
    if (
      !forceBypass &&
      (inFlightProdutosPromise || Date.now() - lastFetch < FETCH_COOLDOWN_MS)
    ) {
      setRateLimited(true);
      return;
    }

    setRateLimited(false);
    clearProdutosSessionCache();
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handleExternalUpdate = () => {
      clearProdutosSessionCache();
      setRateLimited(false);
      setReloadToken((prev) => prev + 1);
    };
    window.addEventListener(PRODUTOS_UPDATED_EVENT, handleExternalUpdate);
    return () => {
      window.removeEventListener(PRODUTOS_UPDATED_EVENT, handleExternalUpdate);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      // 1. Verifica cache obrigatório no sessionStorage (15 min) antes de qualquer consulta
      const cached = readValidCache();
      if (cached !== null) {
        if (isMounted) {
          setProducts(cached);
          setFromCache(true);
          setErrorMessage(null);
          setPermissionError(false);
          setLoading(false);
        }
        return;
      }

      // 2. Proteção contra loops automáticos de requisição ao Firestore
      const lastFetch = readLastFetchTimestamp();
      if (reloadToken === 0 && lastFetch > 0 && Date.now() - lastFetch < FETCH_COOLDOWN_MS) {
        if (isMounted) {
          setRateLimited(true);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setFromCache(false);
        setErrorMessage(null);
        setPermissionError(false);
      }

      try {
        const loadedProducts = await fetchProdutosFromFirestore();

        if (isMounted) {
          setProducts(loadedProducts);
          setErrorMessage(null);
          setPermissionError(false);
          setRateLimited(false);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, "produtos", false);
        const msg = error instanceof Error ? error.message : String(error);
        const isPerm =
          msg.toLowerCase().includes("permission") ||
          msg.toLowerCase().includes("insufficient");

        if (isMounted) {
          setErrorMessage(msg);
          setPermissionError(isPerm);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [reloadToken]);

  return {
    products,
    loading,
    fromCache,
    permissionError,
    errorMessage,
    rateLimited,
    refreshProducts,
  };
}
