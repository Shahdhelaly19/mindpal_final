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

// ✅ version for one token only
export const sendNotification = async (token, title, body, data = {}) => {
  if (!token) {
    console.log("❌ No FCM token provided, skipping notification.");
    return;
  }

  const message = {
    token,
    data: {
      title,
      body,
      ...data,
    },
    android: {
      priority: "high",
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notification sent as DATA message:", response);
  } catch (error) {
    console.error("🔥 Error sending notification:", error);
  }
};
