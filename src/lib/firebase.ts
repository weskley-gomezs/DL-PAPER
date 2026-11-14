import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getDocFromServer, getFirestore } from "firebase/firestore";
import appletFirebaseConfig from "../../firebase-applet-config.json";

// =============================================================================
// CONFIGURAÇÃO DO FIREBASE (Projeto: DL Sistema - dl-sistema-6eee9)
// Para substituir manualmente pelo Console do Firebase ou variáveis de ambiente,
// basta atualizar FIREBASE_API_KEY e FIREBASE_APP_ID abaixo (ou definir
// VITE_FIREBASE_API_KEY e VITE_FIREBASE_APP_ID no .env).
// =============================================================================
const FIREBASE_API_KEY =
  import.meta.env.VITE_FIREBASE_API_KEY || appletFirebaseConfig.apiKey;
const FIREBASE_APP_ID =
  import.meta.env.VITE_FIREBASE_APP_ID || appletFirebaseConfig.appId;

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain:
    appletFirebaseConfig.authDomain || "dl-sistema-6eee9.firebaseapp.com",
  projectId: "dl-sistema-6eee9",
  storageBucket:
    appletFirebaseConfig.storageBucket || "dl-sistema-6eee9.firebasestorage.app",
  messagingSenderId: "1062844818476",
  appId: FIREBASE_APP_ID,
};

// Inicialização modular do Firebase Web SDK v9+
export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Banco de dados padrão (default) do projeto dl-sistema-6eee9 (DL Sistema interno)
export const defaultDb = getFirestore(firebaseApp);

// Banco de dados provisionado no firebase-applet-config.json
export const db = appletFirebaseConfig.firestoreDatabaseId
  ? getFirestore(firebaseApp, appletFirebaseConfig.firestoreDatabaseId)
  : defaultDb;

export const auth = getAuth(firebaseApp);

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function buildFirestoreErrorInfo(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  return {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  shouldThrow = true
): FirestoreErrorInfo {
  const errInfo = buildFirestoreErrorInfo(error, operationType, path);
  console.error("Firestore Error:", JSON.stringify(errInfo));
  if (shouldThrow) {
    throw new Error(JSON.stringify(errInfo));
  }
  return errInfo;
}

// Teste inicial de conectividade com o servidor Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error(
        "Não foi possível conectar ao Firestore (dl-sistema-6eee9). Verifique sua configuração do Firebase."
      );
    }
  }
}

void testConnection();
