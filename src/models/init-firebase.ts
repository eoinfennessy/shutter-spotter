import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage"
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type: "service_account",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
} as ServiceAccount;

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "shutter-spotter.appspot.com",
});

export const firestore = getFirestore();
export const bucket = getStorage().bucket();
