import { initializeApp, credential as _credential, messaging } from 'firebase-admin';
import serviceAccount from "../firebase/firebaseServiceAccountKey.json" assert { type: "json" };

initializeApp({
  credential: _credential.cert(serviceAccount),
});

const token ="eTfeoGMiRn-_XNezQfQlsu:APA91bF2PKkFktyjiYIloVGhUsrmQWIPkFIB8fjeBNU6nq_…";

const message = {
  token: token,
  notification: {
    title: "Reminder",
    body: "Please take your medicine now!",
  },
};

messaging()
  .send(message)
  .then((response) => {
    console.log("✅ Notification sent successfully:", response);
  })
  .catch((error) => {
    console.error("❌ Error sending notification:", error);
  });
