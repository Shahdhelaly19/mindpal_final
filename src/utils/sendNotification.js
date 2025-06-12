import fs from 'fs/promises';
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(
  await fs.readFile("./firebase/firebaseServiceAccountKey.json", "utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const sendNotification = async (token, title, body) => {
  if (!token) {
    console.log("No FCM token provided, skipping notification.");
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
