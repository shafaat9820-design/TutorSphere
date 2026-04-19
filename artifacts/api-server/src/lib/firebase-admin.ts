import admin from "firebase-admin";

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const isConfigValid = 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "your_project_id" &&
  firebaseConfig.clientEmail && 
  firebaseConfig.clientEmail.includes("@") &&
  firebaseConfig.privateKey && 
  firebaseConfig.privateKey.includes("BEGIN PRIVATE KEY");

if (!admin.apps.length) {
  if (isConfigValid) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as any),
      });
      console.log("[FirebaseAdmin] Initialized successfully");
    } catch (error) {
      console.error("[FirebaseAdmin] Initialization error:", error);
    }
  } else {
    console.warn("[FirebaseAdmin] Skipping initialization: Missing or placeholder credentials in .env");
  }
}

export const firebaseAdmin = admin;
export const isFirebaseInitialized = admin.apps.length > 0;
