import { app, BrowserWindow, ipcMain, Notification } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
// import setupPushReceiver from "electron-push-receiver";
import Store from "electron-store";

// 1) IMPORT del push receiver (algunas versiones exportan default, otras named)
import * as EPR from "electron-push-receiver";
const setupPushReceiver =
  (EPR && (EPR.default || EPR.setup)) ? (EPR.default || EPR.setup) : (EPR);




import Store from "electron-store";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const preloadPath = join(__dirname, "preload.cjs");
const swPath = join(__dirname, "firebase-messaging-sw.js");
console.log("[PUSH] typeof setupPR:", typeof setupPR);
console.log("[PUSH] SW exists?", fs.existsSync(swPath), "->", swPath);

app.setAppUserModelId("com.lockity.app"); 

const store = new Store();
function createWindow() {
  console.log("🧪 PRELOAD PATH:", preloadPath);

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: join(__dirname, "images", "logosin.png"),
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  win.loadURL("http://localhost:5173");
try {
  if (fs.existsSync(swPath)) {
    setupPR(win.webContents, swPath);   // preferible si tu versión lo acepta
  } else {
    setupPR(win.webContents);           // fallback
  }} catch (e){
    console.error("[PUSH] Error al configurar el Service Worker:", e);
  }
  setupPushReceiver(win.webContents, swPath);

  win.webContents.on("will-navigate", (event, url) => {
    console.log("navigating to:", url);
    if (url.includes("/users")) {
      console.log("Blocked access to /users in Electron");
      event.preventDefault();
    }
  });


  ipcMain.on("push-receiver-registered", (_e, token) => {
    console.log("✅ FCM token (Electron):", token);
    store.set("fcm_token", token);
    // Si prefieres que el renderer lo registre en tu backend:
    win.webContents.send("push-receiver-registered", token);
  });

  // Notificación recibida
  ipcMain.on("push-receiver-notification", (_e, notif) => {
    console.log("🔔 push-receiver-notification:", notif);
    const n = notif?.notification || notif || {};
    new Notification({
      title: n.title || "Lockity",
      body:  n.body  || "",
      icon:  n.icon  || join(__dirname, "images", "logosin.png"),
    }).show();

    // También al renderer si quieres mostrar UI
    win.webContents.send("push-receiver-notification", notif);
  });

  ipcMain.on("push-receiver-serviceWorkerMessage", (_e, msg) => {
    console.log("ℹ️ SW message:", msg);
  });
  ipcMain.on("push-receiver-error", (_e, err) => {
    console.error("❌ push-receiver-error:", err);
  });

  // 👇 Vuelve a habilitar este handler, tu renderer lo usa
  ipcMain.on("show-notification", (_event, notification) => {
    const { title = "Notificación", body = "", image } = notification || {};
    new Notification({
      title, body,
      icon: image || join(__dirname, "images", "logosin.png"),
    }).show();
  });
}



app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });


// ipcMain.on("show-notification", (_event, notification) => {
//   console.log("🔔 Mostrando notificación:", notification);
//   const { title = "Notificación", body = "", image } = notification;

//   new Notification({
//     title,
//     body,
//     icon: image || join(__dirname, "images", "logosin.png"), // ícono opcional
//   }).show();
// });
