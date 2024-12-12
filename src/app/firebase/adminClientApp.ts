import * as admin from 'firebase-admin';

// Decode service account credentials from environment variable
const serviceAccount = process.env.FIREBASE_KHALI_CREDS
    ? JSON.parse(Buffer.from(process.env.FIREBASE_KHALI_CREDS, 'base64').toString('utf8'))
    : undefined;

if (!admin.apps.length) {
    admin.initializeApp({
        credential: serviceAccount
            ? admin.credential.cert(serviceAccount)
            : admin.credential.applicationDefault(),
    });
}

export const adminDb = admin.firestore();