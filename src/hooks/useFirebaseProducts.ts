import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
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

const LEGACY_SESSION_CACHE_KEYS = [
  "dl_magic_paper_produtos_cache_v2",
  "dl_magic_paper_produtos_last_fetch_v2",
  "dl_magic_paper_produtos_cache",
];
const PRODUTOS_UPDATED_EVENT = "dl_magic_paper_produtos_updated";

export function clearProdutosSessionCache(): void {
  try {
    LEGACY_SESSION_CACHE_KEYS.forEach((key) => {
      window.sessionStorage.removeItem(key);
    });
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

function normalizeSegment(value: unknown): ProductSegment {
  const normalized =
    typeof value === "string" ? value.trim().toLowerCase() : "";
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

export interface UseFirebaseProductsResult {
  products: Product[];
  loading: boolean;
  fromCache: boolean;
  permissionError: boolean;
  errorMessage: string | null;
  rateLimited: boolean;
  refreshProducts: () => void;
}

/**
 * Sincronização em tempo real (sem cache atrasado em sessionStorage)
 * diretamente da coleção `produtos` no banco "ai-studio-f11e477e-6093-47d6-8fee-39ec150930ee".
 */
export function useFirebaseProducts(): UseFirebaseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);
  const [reloadToken, setReloadToken] = useState<number>(0);

  const refreshProducts = useCallback(() => {
    clearProdutosSessionCache();
    setLoading(true);
    setErrorMessage(null);
    setPermissionError(false);

    void getDocs(collection(db, "produtos"))
      .then((snapshot) => {
        const loadedProducts = snapshot.docs
          .map(mapDocToProduct)
          .filter((item): item is Product => item !== null)
          .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        setProducts(loadedProducts);
        setErrorMessage(null);
        setPermissionError(false);
        setLoading(false);
      })
      .catch((error) => {
        handleFirestoreError(
          error,
          OperationType.LIST,
          `produtos (${DL_SISTEMA_DATABASE_ID})`,
          false
        );
        const msg = error instanceof Error ? error.message : String(error);
        const isPerm =
          msg.toLowerCase().includes("permission") ||
          msg.toLowerCase().includes("insufficient");
        setErrorMessage(msg);
        setPermissionError(isPerm);
        setLoading(false);
      });

    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const handleExternalUpdate = () => {
      clearProdutosSessionCache();
      setReloadToken((prev) => prev + 1);
    };
    window.addEventListener(PRODUTOS_UPDATED_EVENT, handleExternalUpdate);
    return () => {
      window.removeEventListener(PRODUTOS_UPDATED_EVENT, handleExternalUpdate);
    };
  }, []);

  useEffect(() => {
    clearProdutosSessionCache();

    if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
      setErrorMessage(
        "Configuração do Firebase incompleta: verifique apiKey e appId para o projeto dl-sistema-6eee9."
      );
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const produtosQuery = collection(db, "produtos");

    const unsubscribe = onSnapshot(
      produtosQuery,
      (snapshot) => {
        if (!isMounted) return;
        const loadedProducts = snapshot.docs
          .map(mapDocToProduct)
          .filter((item): item is Product => item !== null)
          .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

        setProducts(loadedProducts);
        setErrorMessage(null);
        setPermissionError(false);
        setLoading(false);
      },
      (error) => {
        if (!isMounted) return;
        handleFirestoreError(
          error,
          OperationType.LIST,
          `produtos (${DL_SISTEMA_DATABASE_ID})`,
          false
        );
        const msg = error instanceof Error ? error.message : String(error);
        const isPerm =
          msg.toLowerCase().includes("permission") ||
          msg.toLowerCase().includes("insufficient");
        setErrorMessage(msg);
        setPermissionError(isPerm);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [reloadToken]);

  return {
    products,
    loading,
    fromCache: false,
    permissionError,
    errorMessage,
    rateLimited: false,
    refreshProducts,
  };
}
