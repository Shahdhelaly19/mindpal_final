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

import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_KEY_BASE64, "base64").toString("utf8")
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
