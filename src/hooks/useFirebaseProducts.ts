import { useState, useEffect } from "react";
import { collection, onSnapshot, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db, defaultDb, handleFirestoreError, OperationType } from "../lib/firebase";
import { Product, ProductSegment } from "../types";

export interface FirestoreProdutoRaw {
  nome?: unknown;
  precoVenda?: unknown;
  categoriaLinha?: unknown;
  descricao?: unknown;
  imagemUrl?: unknown;
  exibirNoSite?: unknown;
}

function normalizeSegment(value: unknown): ProductSegment {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (normalized === "corporativo" || normalized === "empresa" || normalized === "empresas") {
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

function mapDocToProduct(docSnap: QueryDocumentSnapshot<DocumentData>): Product | null {
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

export interface UseFirebaseProductsResult {
  products: Product[];
  loading: boolean;
  permissionError: boolean;
  errorMessage: string | null;
}

export function useFirebaseProducts(): UseFirebaseProductsResult {
  const [defaultProducts, setDefaultProducts] = useState<Product[]>([]);
  const [appletProducts, setAppletProducts] = useState<Product[]>([]);
  const [defaultLoaded, setDefaultLoaded] = useState(false);
  const [appletLoaded, setAppletLoaded] = useState(db === defaultDb);
  const [defaultError, setDefaultError] = useState<string | null>(null);
  const [appletError, setAppletError] = useState<string | null>(null);

  useEffect(() => {
    const unsubDefault = onSnapshot(
      collection(defaultDb, "produtos"),
      (snapshot) => {
        const mapped = snapshot.docs
          .map(mapDocToProduct)
          .filter((item): item is Product => item !== null)
          .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        setDefaultProducts(mapped);
        setDefaultError(null);
        setDefaultLoaded(true);
      },
      (error) => {
        const info = handleFirestoreError(error, OperationType.GET, "produtos", false);
        setDefaultError(info.error);
        setDefaultLoaded(true);
      }
    );

    let unsubApplet = () => {};
    if (db !== defaultDb) {
      unsubApplet = onSnapshot(
        collection(db, "produtos"),
        (snapshot) => {
          const mapped = snapshot.docs
            .map(mapDocToProduct)
            .filter((item): item is Product => item !== null)
            .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
          setAppletProducts(mapped);
          setAppletError(null);
          setAppletLoaded(true);
        },
        (error) => {
          const info = handleFirestoreError(error, OperationType.GET, "produtos", false);
          setAppletError(info.error);
          setAppletLoaded(true);
        }
      );
    }

    return () => {
      unsubDefault();
      unsubApplet();
    };
  }, []);

  // Prioriza o banco (default) do projeto dl-sistema-6eee9 (DL Sistema); combina sem duplicar caso ambos tenham docs
  const combinedMap = new Map<string, Product>();
  for (const prod of appletProducts) {
    combinedMap.set(prod.id, prod);
  }
  for (const prod of defaultProducts) {
    combinedMap.set(prod.id, prod);
  }

  const products = Array.from(combinedMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );

  const loading = !(defaultLoaded && appletLoaded);
  const hasPermissionIssue =
    products.length === 0 &&
    Boolean(defaultError && defaultError.toLowerCase().includes("permission")) &&
    (db === defaultDb || Boolean(appletError));

  return {
    products,
    loading,
    permissionError: hasPermissionIssue,
    errorMessage: products.length === 0 ? defaultError || appletError : null,
  };
}
