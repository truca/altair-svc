// lib/firebaseAdmin.ts
import admin from "firebase-admin";

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: firebasePrivateKey?.replace(/\\n/g, "\n"),
    }),
  });
}

export const verifyIdToken = (token: string) => {
  return admin.auth().verifyIdToken(token);
};
