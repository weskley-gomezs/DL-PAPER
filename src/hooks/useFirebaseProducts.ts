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
  testConnection,
} from "../lib/firebase";
import { Product, ProductSegment } from "../types";

const SESSION_CACHE_KEY = "dl_magic_paper_produtos_cache_v2";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutos
const FIRESTORE_TIMEOUT_MS = 12000; // Evita loading infinito

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

function parsePrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, value);
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.,-]/g, "").replace(",", ".");
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) {
      return Math.max(0, parsed);
    }
  }
  return 0;
}

function mapDocToProduct(
  docSnap: QueryDocumentSnapshot<DocumentData>
): Product | null {
  const raw = docSnap.data() as FirestoreProdutoRaw;

  // Se exibirNoSite === false, não exibe na vitrine pública
  if (raw.exibirNoSite === false) {
    return null;
  }

  const nome =
    typeof raw.nome === "string" && raw.nome.trim().length > 0
      ? raw.nome.trim()
      : "Produto Personalizado";

  const precoVenda = parsePrice(raw.precoVenda);
  const segment = normalizeSegment(raw.categoriaLinha);

  const descricao =
    typeof raw.descricao === "string" && raw.descricao.trim().length > 0
      ? raw.descricao.trim()
      : "Papelaria personalizada artesanal com acabamento premium feita em Brasília - DF.";

  const imagemUrl =
    typeof raw.imagemUrl === "string" && raw.imagemUrl.trim().length > 0
      ? raw.imagemUrl.trim()
      : "";

  const categoryLabel =
    segment === "corporativo"
      ? "Linha Corporativa"
      : segment === "ambos"
      ? "Festa & Corporativo"
      : "Linha Festa";

  return {
    id: docSnap.id,
    name: nome,
    category: categoryLabel,
    segment,
    minPrice: precoVenda,
    maxPrice: precoVenda,
    precoVenda,
    description: descricao,
    image: imagemUrl,
    exibirNoSite: raw.exibirNoSite !== false,
    features: [
      "Produção artesanal DL Magic Paper",
      "Personalizado com sua identidade ou tema",
      "Atendimento direto em Brasília - DF",
    ],
  };
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

    return parsed.products;
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

export interface UseFirebaseProductsResult {
  products: Product[];
  loading: boolean;
  fromCache: boolean;
  permissionError: boolean;
  errorMessage: string | null;
  refreshProducts: () => void;
}

export function useFirebaseProducts(): UseFirebaseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const refreshProducts = useCallback(() => {
    try {
      window.sessionStorage.removeItem(SESSION_CACHE_KEY);
    } catch {
      // ignore
    }
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      // 1. Verifica cache no sessionStorage (15 min) antes de qualquer consulta
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

      if (isMounted) {
        setLoading(true);
        setFromCache(false);
        setErrorMessage(null);
        setPermissionError(false);
      }

      try {
        if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
          throw new Error(
            "Configuração do Firebase incompleta: verifique apiKey e appId para o projeto dl-sistema-6eee9."
          );
        }

        // Teste leve de conexão com o servidor quando não há cache
        void testConnection();

        const snapshot = await withTimeout(
          getDocs(collection(db, "produtos")),
          FIRESTORE_TIMEOUT_MS,
          `produtos (${DL_SISTEMA_DATABASE_ID})`
        );

        const loadedProducts = snapshot.docs
          .map(mapDocToProduct)
          .filter((item): item is Product => item !== null)
          .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

        if (isMounted) {
          setProducts(loadedProducts);
          setErrorMessage(null);
          setPermissionError(false);
        }

        // Salva no sessionStorage por 15 minutos
        writeCache(loadedProducts);
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
    refreshProducts,
  };
}
