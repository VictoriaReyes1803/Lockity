const { contextBridge } = require("electron");
const fs = require("fs");
// const mqtt = require("mqtt");
const path = require("path");
let mqtt;
try {
  mqtt = require("mqtt");
} catch (err) {
  console.error("❌ No se pudo cargar mqtt:", err);
  throw err;
}

let client = null;

const connectToMQTT = () => {
  if (!client) {
    client = mqtt.connect("mqtts://64.23.237.187:8883", {
      username: 'esp32',
      password: 'e]|xh)T£HMOA8T?;,|EiO7oLU8+~u]f)7v6Ydfg`7£}k2,,Q`0',
      ca: fs.readFileSync(path.resolve(__dirname, "../electron/certs/ca.crt")),
      rejectUnauthorized: false,
    });

    client.on("connect", () => {
      console.log("✅ MQTT conectado desde preload");
    });

    client.on("error", (err) => {
      console.error("❌ MQTT error:", err);
    });
  }

  return client;
};

contextBridge.exposeInMainWorld("electronAPI", {
  publishToggleCommand: (serial, userId, drawer) => {
    const client = connectToMQTT();
    const topic = `${serial}/command/toggle`;
    const payload = JSON.stringify({
      id_usuario: userId.toString(),
      id_drawer: drawer.toString(),
      valor: 1,
    });
    console.log("📡 Enviando comando MQTT:", topic, payload);
    client.publish(topic, payload);
  },
});
