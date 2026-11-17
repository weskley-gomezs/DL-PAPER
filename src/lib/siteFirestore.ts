import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import {
  auth,
  db,
  DL_SISTEMA_DATABASE_ID,
  handleFirestoreError,
  OperationType,
} from "./firebase";
import {
  HeroBannerItem,
  ProductSegment,
  TestimonialPrintItem,
  ThemeItem,
} from "../types";
import type { AboutTexts, AppDataState, HeroTexts } from "../context/DataContext";
import { notifyProdutosUpdated } from "../hooks/useFirebaseProducts";

const SITE_CONFIG_COLLECTION = "site_config";
const SITE_CONFIG_PRINCIPAL_DOC = "principal";
const BANNERS_COLLECTION = "banners";
const FEEDBACKS_COLLECTION = "feedbacks";

export interface FirestoreMutationResult {
  ok: boolean;
  id?: string;
  isPermissionError?: boolean;
  error?: string;
}

export interface DlSistemaReadStatus {
  permissionDeniedOnDlSistema: boolean;
  deniedPaths: string[];
}

let lastReadStatus: DlSistemaReadStatus = {
  permissionDeniedOnDlSistema: false,
  deniedPaths: [],
};

export function getDlSistemaReadStatus(): DlSistemaReadStatus {
  return {
    permissionDeniedOnDlSistema: lastReadStatus.permissionDeniedOnDlSistema,
    deniedPaths: [...lastReadStatus.deniedPaths],
  };
}

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const clean: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  }
  return clean;
}

function isPermissionDeniedError(error: unknown): boolean {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
  const msg = error instanceof Error ? error.message : String(error);
  const lower = `${code} ${msg}`.toLowerCase();
  return (
    lower.includes("permission-denied") ||
    lower.includes("permission") ||
    lower.includes("insufficient") ||
    lower.includes("missing or insufficient")
  );
}

function formatFirestoreWriteError(error: unknown): {
  isPermissionError: boolean;
  message: string;
} {
  const isPerm = isPermissionDeniedError(error);
  const rawMsg = error instanceof Error ? error.message : String(error);
  if (isPerm) {
    const email = auth.currentUser?.email;
    return {
      isPermissionError: true,
      message: email
        ? `Permissão negada no banco "${DL_SISTEMA_DATABASE_ID}" para a conta "${email}". No Firebase Console, selecione exatamente o banco "${DL_SISTEMA_DATABASE_ID}" na aba Regras (Rules), adicione "${email}" na função isAdmin() e clique em Publicar.`
        : `Permissão negada no banco "${DL_SISTEMA_DATABASE_ID}". Conecte sua conta Google autorizada no topo do Painel Admin.`,
    };
  }
  return {
    isPermissionError: false,
    message: rawMsg || "Erro desconhecido ao salvar no Firestore.",
  };
}

function applyPrincipalDocFields(
  merged: Partial<AppDataState>,
  raw: Record<string, unknown>
): void {
  if (typeof raw.logo === "string") merged.logo = raw.logo;
  if (typeof raw.heroImage === "string") merged.heroImage = raw.heroImage;
  if (typeof raw.heroVideo === "string") merged.heroVideo = raw.heroVideo;
  if (typeof raw.aboutImage === "string") merged.aboutImage = raw.aboutImage;
  if (typeof raw.partyFavorsImage === "string")
    merged.partyFavorsImage = raw.partyFavorsImage;
  if (typeof raw.whatsappNumber === "string")
    merged.whatsappNumber = raw.whatsappNumber;
  if (typeof raw.whatsappFormatted === "string")
    merged.whatsappFormatted = raw.whatsappFormatted;
  if (typeof raw.instagramHandle === "string")
    merged.instagramHandle = raw.instagramHandle;
  if (typeof raw.instagramUrl === "string")
    merged.instagramUrl = raw.instagramUrl;
  if (typeof raw.isComingSoon === "boolean")
    merged.isComingSoon = raw.isComingSoon;
  if (typeof raw.comingSoonTitle === "string")
    merged.comingSoonTitle = raw.comingSoonTitle;
  if (typeof raw.comingSoonSubtitle === "string")
    merged.comingSoonSubtitle = raw.comingSoonSubtitle;
  if (raw.heroTexts && typeof raw.heroTexts === "object") {
    merged.heroTexts = raw.heroTexts as HeroTexts;
  }
  if (raw.aboutTexts && typeof raw.aboutTexts === "object") {
    merged.aboutTexts = raw.aboutTexts as AboutTexts;
  }
  if (Array.isArray(raw.kitGalleryFeminina)) {
    merged.kitGalleryFeminina = raw.kitGalleryFeminina.filter(
      (item): item is string => typeof item === "string"
    );
  }
  if (Array.isArray(raw.kitGalleryMasculina)) {
    merged.kitGalleryMasculina = raw.kitGalleryMasculina.filter(
      (item): item is string => typeof item === "string"
    );
  }
  if (Array.isArray(raw.themes)) {
    merged.themes = raw.themes as ThemeItem[];
  }
}

/**
 * Lê publicamente todas as coleções do site via getDocs() exclusivamente no banco
 * "ai-studio-f11e477e-6093-47d6-8fee-39ec150930ee" (sem exigir login do visitante):
 * - site_config (documento `principal`, com compatibilidade de leitura para documentos legados)
 * - banners
 * - feedbacks
 */
export async function loadSiteConfigFromFirestore(): Promise<Partial<AppDataState> | null> {
  const results = await Promise.allSettled([
    getDocs(collection(db, SITE_CONFIG_COLLECTION)),
    getDocs(collection(db, BANNERS_COLLECTION)),
    getDocs(collection(db, FEEDBACKS_COLLECTION)),
  ]);

  const [siteConfigRes, bannersColRes, feedbacksColRes] = results;

  const merged: Partial<AppDataState> = {};
  const deniedPaths: string[] = [];
  let hasAny = false;

  if (siteConfigRes.status === "fulfilled") {
    const docsById = new Map<string, Record<string, unknown>>();
    siteConfigRes.value.docs.forEach((d) => {
      docsById.set(d.id, d.data() as Record<string, unknown>);
    });

    // Compatibilidade caso existam documentos antigos antes da consolidação em `principal`
    const legacyGeral = docsById.get("geral");
    if (legacyGeral) {
      hasAny = true;
      applyPrincipalDocFields(merged, legacyGeral);
    }
    const legacyFem = docsById.get("galleries_feminina");
    if (legacyFem && Array.isArray(legacyFem.items)) {
      hasAny = true;
      merged.kitGalleryFeminina = legacyFem.items as string[];
    }
    const legacyMasc = docsById.get("galleries_masculina");
    if (legacyMasc && Array.isArray(legacyMasc.items)) {
      hasAny = true;
      merged.kitGalleryMasculina = legacyMasc.items as string[];
    }
    const legacyGalleries = docsById.get("galleries");
    if (legacyGalleries) {
      hasAny = true;
      if (Array.isArray(legacyGalleries.feminina)) {
        merged.kitGalleryFeminina = legacyGalleries.feminina as string[];
      }
      if (Array.isArray(legacyGalleries.masculina)) {
        merged.kitGalleryMasculina = legacyGalleries.masculina as string[];
      }
    }
    const legacyThemes = docsById.get("themes");
    if (legacyThemes && Array.isArray(legacyThemes.items)) {
      hasAny = true;
      merged.themes = legacyThemes.items as ThemeItem[];
    }
    const legacyBanners = docsById.get("banners");
    if (legacyBanners && Array.isArray(legacyBanners.items)) {
      hasAny = true;
      merged.heroBanners = legacyBanners.items as HeroBannerItem[];
    }
    const legacyTestimonials = docsById.get("testimonials");
    if (legacyTestimonials && Array.isArray(legacyTestimonials.items)) {
      hasAny = true;
      merged.testimonialPrints =
        legacyTestimonials.items as TestimonialPrintItem[];
    }

    // Documento oficial: site_config/principal (prevalece sobre qualquer legado)
    const principalDoc = docsById.get(SITE_CONFIG_PRINCIPAL_DOC);
    if (principalDoc) {
      hasAny = true;
      applyPrincipalDocFields(merged, principalDoc);
    }
  } else if (siteConfigRes.status === "rejected") {
    if (isPermissionDeniedError(siteConfigRes.reason)) {
      deniedPaths.push(SITE_CONFIG_COLLECTION);
      console.warn(
        `Leitura pública bloqueada em "${SITE_CONFIG_COLLECTION}" no banco "${DL_SISTEMA_DATABASE_ID}".`
      );
    } else {
      handleFirestoreError(
        siteConfigRes.reason,
        OperationType.LIST,
        SITE_CONFIG_COLLECTION,
        false
      );
    }
  }

  // Banners: coleção pública `banners`
  if (bannersColRes.status === "fulfilled") {
    if (!bannersColRes.value.empty) {
      hasAny = true;
      merged.heroBanners = bannersColRes.value.docs
        .map((d) => {
          const raw = d.data() as {
            src?: string;
            title?: string;
            subtitle?: string;
            order?: number;
          };
          return {
            id: d.id,
            src: typeof raw.src === "string" ? raw.src : "",
            title: typeof raw.title === "string" ? raw.title : "",
            subtitle: typeof raw.subtitle === "string" ? raw.subtitle : "",
            order: typeof raw.order === "number" ? raw.order : 0,
          };
        })
        .sort((a, b) => a.order - b.order)
        .map(({ id, src, title, subtitle }) => ({ id, src, title, subtitle }));
    }
  } else if (bannersColRes.status === "rejected") {
    if (isPermissionDeniedError(bannersColRes.reason)) {
      deniedPaths.push(BANNERS_COLLECTION);
      console.warn(
        `Leitura pública bloqueada em "${BANNERS_COLLECTION}" no banco "${DL_SISTEMA_DATABASE_ID}".`
      );
    } else {
      handleFirestoreError(
        bannersColRes.reason,
        OperationType.LIST,
        BANNERS_COLLECTION,
        false
      );
    }
  }

  // Feedbacks: coleção pública `feedbacks`
  if (feedbacksColRes.status === "fulfilled") {
    if (!feedbacksColRes.value.empty) {
      hasAny = true;
      merged.testimonialPrints = feedbacksColRes.value.docs
        .map((d) => {
          const raw = d.data() as {
            url?: string;
            alt?: string;
            order?: number;
          };
          return {
            id: d.id,
            url: typeof raw.url === "string" ? raw.url : "",
            alt:
              typeof raw.alt === "string"
                ? raw.alt
                : "Depoimento de cliente DL Magic Paper",
            order: typeof raw.order === "number" ? raw.order : 0,
          };
        })
        .sort((a, b) => a.order - b.order)
        .map(({ id, url, alt }) => ({ id, url, alt }));
    }
  } else if (feedbacksColRes.status === "rejected") {
    if (isPermissionDeniedError(feedbacksColRes.reason)) {
      deniedPaths.push(FEEDBACKS_COLLECTION);
      console.warn(
        `Leitura pública bloqueada em "${FEEDBACKS_COLLECTION}" no banco "${DL_SISTEMA_DATABASE_ID}".`
      );
    } else {
      handleFirestoreError(
        feedbacksColRes.reason,
        OperationType.LIST,
        FEEDBACKS_COLLECTION,
        false
      );
    }
  }

  lastReadStatus = {
    permissionDeniedOnDlSistema: deniedPaths.length > 0,
    deniedPaths,
  };

  return hasAny ? merged : null;
}

async function syncCollectionDocs<T extends { id: string }>(
  collectionName: string,
  items: T[],
  mapPayload: (item: T, index: number, now: number) => Record<string, unknown>
): Promise<void> {
  const existingSnap = await getDocs(collection(db, collectionName));
  const keepIds = new Set(items.map((item) => item.id));
  const now = Date.now();

  const writes = items.map((item, idx) =>
    setDoc(doc(db, collectionName, item.id), mapPayload(item, idx, now), {
      merge: true,
    })
  );

  const deletes = existingSnap.docs
    .filter((d) => !keepIds.has(d.id))
    .map((d) => deleteDoc(doc(db, collectionName, d.id)));

  await Promise.all([...writes, ...deletes]);
}

/**
 * Grava configurações e imagens exclusivamente no banco "ai-studio-f11e477e-6093-47d6-8fee-39ec150930ee":
 * - site_config/principal: logo, banners fixos, textos, contatos, galerias e temas
 * - banners/{id}: banners animados do carrossel
 * - feedbacks/{id}: depoimentos/prints de clientes
 */
export async function saveSiteConfigToFirestore(
  partial: Partial<AppDataState>
): Promise<FirestoreMutationResult> {
  if (!auth.currentUser) {
    return {
      ok: false,
      isPermissionError: true,
      error:
        "Conecte sua conta Google autorizada no topo do Painel Admin antes de salvar no Firestore.",
    };
  }

  try {
    const ops: Promise<unknown>[] = [];
    const now = Date.now();

    const principalPayload = stripUndefined({
      logo: partial.logo,
      heroImage: partial.heroImage,
      heroVideo: partial.heroVideo,
      aboutImage: partial.aboutImage,
      partyFavorsImage: partial.partyFavorsImage,
      whatsappNumber: partial.whatsappNumber,
      whatsappFormatted: partial.whatsappFormatted,
      instagramHandle: partial.instagramHandle,
      instagramUrl: partial.instagramUrl,
      isComingSoon: partial.isComingSoon,
      comingSoonTitle: partial.comingSoonTitle,
      comingSoonSubtitle: partial.comingSoonSubtitle,
      heroTexts: partial.heroTexts,
      aboutTexts: partial.aboutTexts,
      kitGalleryFeminina: partial.kitGalleryFeminina,
      kitGalleryMasculina: partial.kitGalleryMasculina,
      themes: partial.themes,
    });

    if (Object.keys(principalPayload).length > 0) {
      ops.push(
        setDoc(
          doc(db, SITE_CONFIG_COLLECTION, SITE_CONFIG_PRINCIPAL_DOC),
          { ...principalPayload, updatedAt: now },
          { merge: true }
        )
      );
    }

    if (partial.heroBanners !== undefined) {
      ops.push(
        syncCollectionDocs(
          BANNERS_COLLECTION,
          partial.heroBanners,
          (b, idx, ts) => ({
            src: b.src,
            title: b.title,
            subtitle: b.subtitle,
            order: idx,
            updatedAt: ts,
          })
        )
      );
    }

    if (partial.testimonialPrints !== undefined) {
      ops.push(
        syncCollectionDocs(
          FEEDBACKS_COLLECTION,
          partial.testimonialPrints,
          (f, idx, ts) => ({
            url: f.url,
            alt: f.alt,
            order: idx,
            updatedAt: ts,
          })
        )
      );
    }

    if (ops.length > 0) {
      await Promise.all(ops);
    }

    lastReadStatus = {
      permissionDeniedOnDlSistema: false,
      deniedPaths: [],
    };

    return { ok: true };
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `${SITE_CONFIG_COLLECTION}/${SITE_CONFIG_PRINCIPAL_DOC}`,
      false
    );
    const formatted = formatFirestoreWriteError(error);
    return {
      ok: false,
      isPermissionError: formatted.isPermissionError,
      error: formatted.message,
    };
  }
}

export interface SaveFirestoreProdutoInput {
  id?: string;
  nome: string;
  precoVenda: number;
  categoriaLinha: ProductSegment;
  descricao: string;
  imagemUrl: string;
  exibirNoSite?: boolean;
}

export async function saveProductToFirestore(
  input: SaveFirestoreProdutoInput
): Promise<FirestoreMutationResult> {
  if (!auth.currentUser) {
    return {
      ok: false,
      isPermissionError: true,
      error:
        "Conecte sua conta Google autorizada no topo do Painel Admin antes de salvar produtos no Firestore.",
    };
  }

  const payload = {
    nome: input.nome.trim(),
    precoVenda: Number(input.precoVenda),
    categoriaLinha: input.categoriaLinha || "pessoal",
    descricao: input.descricao.trim(),
    imagemUrl: input.imagemUrl.trim(),
    exibirNoSite: input.exibirNoSite !== false,
  };

  try {
    let savedId = input.id;
    if (savedId) {
      await setDoc(doc(db, "produtos", savedId), payload, { merge: true });
    } else {
      const createdRef = await addDoc(collection(db, "produtos"), payload);
      savedId = createdRef.id;
    }

    notifyProdutosUpdated();
    return { ok: true, id: savedId };
  } catch (error) {
    handleFirestoreError(
      error,
      input.id ? OperationType.UPDATE : OperationType.CREATE,
      input.id ? `produtos/${input.id}` : "produtos",
      false
    );
    const formatted = formatFirestoreWriteError(error);
    return {
      ok: false,
      isPermissionError: formatted.isPermissionError,
      error: formatted.message,
    };
  }
}

export async function deleteProductFromFirestore(
  id: string
): Promise<FirestoreMutationResult> {
  if (!auth.currentUser) {
    return {
      ok: false,
      isPermissionError: true,
      error:
        "Conecte sua conta Google autorizada no topo do Painel Admin antes de excluir produtos no Firestore.",
    };
  }

  try {
    await deleteDoc(doc(db, "produtos", id));
    notifyProdutosUpdated();
    return { ok: true };
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `produtos/${id}`,
      false
    );
    const formatted = formatFirestoreWriteError(error);
    return {
      ok: false,
      isPermissionError: formatted.isPermissionError,
      error: formatted.message,
    };
  }
}
