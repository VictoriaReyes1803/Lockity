import { app, BrowserWindow, ipcMain, Notification } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Store from "electron-store";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const preloadPath = join(__dirname, "preload.cjs");
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


  setupPushReceiver(win.webContents);

  // ───────── Eventos del receptor ─────────
  // Token FCM generado
  ipcMain.on("push-receiver-registered", (_e, token) => {
    console.log("✅ FCM token (Electron):", token);
    store.set("fcm_token", token);
    // si quieres, envíalo a tu backend para poder enviar a este desktop
  });

  // Notificación recibida
  ipcMain.on("push-receiver-notification", (_e, notif) => {
    // notif.notification es el objeto con title/body/icon típico de FCM
    const n = notif?.notification || notif || {};
    const title = n.title || "Lockity";
    const body  = n.body  || "";
    const icon  = n.icon  || join(__dirname, "images", "logosin.png");
    new Notification({ title, body, icon }).show();

    // (opcional) confirmar recepción si tu backend lo requiere
    // _e.sender.send('push-receiver-notification-handled', notif);
  });

  
  win.webContents.on("will-navigate", (event, url) => {
    console.log("navigating to:", url);
    if (url.includes("/users")) {
      console.log("Blocked access to /users in Electron");
      event.preventDefault();
    }
  });

  ipcMain.on("push-receiver-serviceWorkerMessage", (_e, msg) => {
    console.log("ℹ️ SW message:", msg);
  });

  // Errores del receiver
  ipcMain.on("push-receiver-error", (_e, err) => {
    console.error("❌ push-receiver-error:", err);
  });

  win.once("ready-to-show", () => win.show());

}




app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// ipcMain.on("show-notification", (_event, notification) => {
//   console.log("🔔 Mostrando notificación:", notification);
//   const { title = "Notificación", body = "", image } = notification;

//   new Notification({
//     title,
//     body,
//     icon: image || join(__dirname, "images", "logosin.png"), // ícono opcional
//   }).show();
// });
