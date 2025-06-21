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

// ✅ Send notification for both doctor/patient
export const sendNotification = async (token, title, body, data = {}, mode = "patient") => {
  if (!token) {
    console.log("❌ No FCM token provided, skipping notification.");
    return;
  }

  let message;

  if (mode === "patient") {
    message = {
      token,
      notification: { title, body },
      data: { ...data },
      android: { priority: "high" },
      apns: {
        headers: { "apns-priority": "10" },
        payload: { aps: { contentAvailable: true } },
      },
    };
  } else if (mode === "doctor") {
    message = {
      token,
      notification: { title, body },
      data: { ...data },
      android: { priority: "high" },
      apns: {
        headers: { "apns-priority": "10" },
        payload: {
          aps: {
            alert: { title, body },
            sound: "default"
          }
        },
      },
    };
  }

  try {
    const response = await admin.messaging().send(message);
    console.log(`✅ Notification (${mode}) sent:`, response);
  } catch (error) {
    console.error("🔥 Error sending notification:", error);
  }
};
