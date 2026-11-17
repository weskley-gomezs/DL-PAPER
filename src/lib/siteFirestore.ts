import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { appletDb, auth, db, handleFirestoreError, OperationType } from "./firebase";
import { HeroBannerItem, ProductSegment, TestimonialPrintItem, ThemeItem } from "../types";
import type { AboutTexts, AppDataState, HeroTexts } from "../context/DataContext";
import { notifyProdutosUpdated } from "../hooks/useFirebaseProducts";

const SITE_CONFIG_COLLECTION = "site_config";

function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const clean: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  }
  return clean;
}

export async function loadSiteConfigFromFirestore(): Promise<Partial<AppDataState> | null> {
  try {
    const [geralSnap, bannersSnap, testimonialsSnap, galleriesSnap, themesSnap] =
      await Promise.all([
        getDoc(doc(appletDb, SITE_CONFIG_COLLECTION, "geral")),
        getDoc(doc(appletDb, SITE_CONFIG_COLLECTION, "banners")),
        getDoc(doc(appletDb, SITE_CONFIG_COLLECTION, "testimonials")),
        getDoc(doc(appletDb, SITE_CONFIG_COLLECTION, "galleries")),
        getDoc(doc(appletDb, SITE_CONFIG_COLLECTION, "themes")),
      ]);

    const merged: Partial<AppDataState> = {};
    let hasAny = false;

    if (geralSnap.exists()) {
      hasAny = true;
      const g = geralSnap.data() as Partial<AppDataState>;
      if (typeof g.logo === "string") merged.logo = g.logo;
      if (typeof g.heroImage === "string") merged.heroImage = g.heroImage;
      if (typeof g.heroVideo === "string") merged.heroVideo = g.heroVideo;
      if (typeof g.aboutImage === "string") merged.aboutImage = g.aboutImage;
      if (typeof g.partyFavorsImage === "string")
        merged.partyFavorsImage = g.partyFavorsImage;
      if (typeof g.whatsappNumber === "string")
        merged.whatsappNumber = g.whatsappNumber;
      if (typeof g.whatsappFormatted === "string")
        merged.whatsappFormatted = g.whatsappFormatted;
      if (typeof g.instagramHandle === "string")
        merged.instagramHandle = g.instagramHandle;
      if (typeof g.instagramUrl === "string")
        merged.instagramUrl = g.instagramUrl;
      if (typeof g.isComingSoon === "boolean")
        merged.isComingSoon = g.isComingSoon;
      if (typeof g.comingSoonTitle === "string")
        merged.comingSoonTitle = g.comingSoonTitle;
      if (typeof g.comingSoonSubtitle === "string")
        merged.comingSoonSubtitle = g.comingSoonSubtitle;
      if (g.heroTexts && typeof g.heroTexts === "object") {
        merged.heroTexts = g.heroTexts as HeroTexts;
      }
      if (g.aboutTexts && typeof g.aboutTexts === "object") {
        merged.aboutTexts = g.aboutTexts as AboutTexts;
      }
    }

    if (bannersSnap.exists()) {
      hasAny = true;
      const b = bannersSnap.data() as { items?: HeroBannerItem[] };
      if (Array.isArray(b.items)) {
        merged.heroBanners = b.items;
      }
    }

    if (testimonialsSnap.exists()) {
      hasAny = true;
      const t = testimonialsSnap.data() as { items?: TestimonialPrintItem[] };
      if (Array.isArray(t.items)) {
        merged.testimonialPrints = t.items;
      }
    }

    if (galleriesSnap.exists()) {
      hasAny = true;
      const gal = galleriesSnap.data() as {
        feminina?: string[];
        masculina?: string[];
      };
      if (Array.isArray(gal.feminina)) {
        merged.kitGalleryFeminina = gal.feminina;
      }
      if (Array.isArray(gal.masculina)) {
        merged.kitGalleryMasculina = gal.masculina;
      }
    }

    if (themesSnap.exists()) {
      hasAny = true;
      const th = themesSnap.data() as { items?: ThemeItem[] };
      if (Array.isArray(th.items)) {
        merged.themes = th.items;
      }
    }

    return hasAny ? merged : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, SITE_CONFIG_COLLECTION, false);
    return null;
  }
}

export async function saveSiteConfigToFirestore(
  partial: Partial<AppDataState>
): Promise<{ ok: boolean; error?: string }> {
  if (!auth.currentUser) {
    return {
      ok: false,
      error:
        "Conecte a conta Google autorizada no topo do Painel Admin para gravar no Firestore.",
    };
  }

  try {
    const ops: Promise<void>[] = [];
    const now = Date.now();

    const geralPayload = stripUndefined({
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
    });

    if (Object.keys(geralPayload).length > 0) {
      ops.push(
        setDoc(
          doc(appletDb, SITE_CONFIG_COLLECTION, "geral"),
          { ...geralPayload, updatedAt: now },
          { merge: true }
        )
      );
    }

    if (partial.heroBanners !== undefined) {
      ops.push(
        setDoc(
          doc(appletDb, SITE_CONFIG_COLLECTION, "banners"),
          { items: partial.heroBanners, updatedAt: now },
          { merge: true }
        )
      );
    }

    if (partial.testimonialPrints !== undefined) {
      ops.push(
        setDoc(
          doc(appletDb, SITE_CONFIG_COLLECTION, "testimonials"),
          { items: partial.testimonialPrints, updatedAt: now },
          { merge: true }
        )
      );
    }

    if (
      partial.kitGalleryFeminina !== undefined ||
      partial.kitGalleryMasculina !== undefined
    ) {
      const galPayload = stripUndefined({
        feminina: partial.kitGalleryFeminina,
        masculina: partial.kitGalleryMasculina,
      });
      ops.push(
        setDoc(
          doc(appletDb, SITE_CONFIG_COLLECTION, "galleries"),
          { ...galPayload, updatedAt: now },
          { merge: true }
        )
      );
    }

    if (partial.themes !== undefined) {
      ops.push(
        setDoc(
          doc(appletDb, SITE_CONFIG_COLLECTION, "themes"),
          { items: partial.themes, updatedAt: now },
          { merge: true }
        )
      );
    }

    if (ops.length > 0) {
      await Promise.all(ops);
    }

    return { ok: true };
  } catch (error) {
    const info = handleFirestoreError(
      error,
      OperationType.WRITE,
      SITE_CONFIG_COLLECTION,
      false
    );
    return { ok: false, error: info.error };
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
): Promise<{ ok: boolean; id?: string; error?: string }> {
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
    const info = handleFirestoreError(
      error,
      input.id ? OperationType.UPDATE : OperationType.CREATE,
      input.id ? `produtos/${input.id}` : "produtos",
      false
    );
    return { ok: false, error: info.error };
  }
}

export async function deleteProductFromFirestore(
  id: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, "produtos", id));
    notifyProdutosUpdated();
    return { ok: true };
  } catch (error) {
    const info = handleFirestoreError(
      error,
      OperationType.DELETE,
      `produtos/${id}`,
      false
    );
    return { ok: false, error: info.error };
  }
}
