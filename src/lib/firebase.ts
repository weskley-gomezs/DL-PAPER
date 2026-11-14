import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDocFromServer,
  getFirestore,
  initializeFirestore,
  Firestore,
} from "firebase/firestore";
import appletFirebaseConfig from "../../firebase-applet-config.json";

// =============================================================================
// CONFIGURAÇÃO DO FIREBASE (Projeto: DL Sistema - dl-sistema-6eee9)
// Banco nomeado onde o DL Sistema salva os dados em produção.
// =============================================================================
export const DL_SISTEMA_DATABASE_ID =
  "ai-studio-f11e477e-6093-47d6-8fee-39ec150930ee";

const FIREBASE_API_KEY = (
  import.meta.env.VITE_FIREBASE_API_KEY ||
  appletFirebaseConfig.apiKey ||
  "AIzaSyCzKf4E23Lc6iOlGJ0LCMADWN9u2bnhGhI"
).trim();

const FIREBASE_APP_ID = (
  import.meta.env.VITE_FIREBASE_APP_ID ||
  "1:1062844818476:web:b1a04a13bfafc2ae781d89"
).trim();

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "dl-sistema-6eee9.firebaseapp.com",
  projectId: "dl-sistema-6eee9",
  storageBucket: "dl-sistema-6eee9.firebasestorage.app",
  messagingSenderId: "1062844818476",
  appId: FIREBASE_APP_ID,
};

// Inicialização modular do Firebase Web SDK v9+
export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function initNamedFirestore(databaseId: string): Firestore {
  try {
    return initializeFirestore(
      firebaseApp,
      { experimentalForceLongPolling: true },
      databaseId
    );
  } catch {
    return getFirestore(firebaseApp, databaseId);
  }
}

// Aponta explicitamente para o banco de dados nomeado do DL Sistema (não usa "(default)")
export const db = initNamedFirestore(DL_SISTEMA_DATABASE_ID);

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

// Teste de conectividade com o servidor Firestore
export async function testConnection(): Promise<void> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error(
        `Não foi possível conectar ao Firestore (${DL_SISTEMA_DATABASE_ID}). Verifique sua configuração do Firebase.`
      );
    }
  }
}
