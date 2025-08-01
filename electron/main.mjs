import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { ipcMain, Notification } from "electron";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const preloadPath = join(__dirname, "preload.cjs");

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

  win.loadURL("https://lockity.site");

  win.webContents.on("will-navigate", (event, url) => {
    console.log("navigating to:", url);
    if (url.includes("/users")) {
      console.log("Blocked access to /users in Electron");
      event.preventDefault();
    }
  });
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

ipcMain.on("show-notification", (_event, notification) => {
  const { title = "Notificación", body = "", image } = notification;

  new Notification({
    title,
    body,
    icon: image || join(__dirname, "images", "logosin.png"), // ícono opcional
  }).show();
});
