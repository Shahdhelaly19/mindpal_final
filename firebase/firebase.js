import fs from 'fs/promises';
import admin from 'firebase-admin';

// Initialization once
const serviceAccount = JSON.parse(
  await fs.readFile("./firebase/firebaseServiceAccountKey.json", "utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
