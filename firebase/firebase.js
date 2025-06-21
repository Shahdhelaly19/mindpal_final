// import fs from 'fs/promises';
// import admin from 'firebase-admin';

// // Initialization once
// const serviceAccount = JSON.parse(
//   await fs.readFile("./firebase/firebaseServiceAccountKey.json", "utf-8")
// );

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export default admin;
import admin from 'firebase-admin';

// Initializing Firebase Admin with ENV variables
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export default admin;
