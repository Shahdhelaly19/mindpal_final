import { sendNotification } from "./sendNotification.js"; // ✅ غير المسار لو حاطاه في مكان تاني

const doctorToken =
"e3QDomWZSLOPeuz_SieH9W:APA91bHJWtY7xxXqZn9_7QkMfd0NEaRyJql4RQ1rjtqr45F833a8jVmI29-Vw4rRI1aI3GzEglTCusG761SNjXeAayQAfjXK1ffY0rJeeNuif15IOVM6ljM";
sendNotification(
  doctorToken,
  "🧠 Test Doctor Notification",
  "This is a test notification to the doctor device.",
  {
    type: "test",
    who: "doctor"
  }
);
