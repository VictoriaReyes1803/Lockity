// lib/mqttClient.ts
import mqtt from 'mqtt';

const MQTT_BROKER_URL = import.meta.env.VITE_MQTT_BROKER_URL;

let client: mqtt.MqttClient | null = null;

export const connectToMQTT = () => {
  if (typeof window === 'undefined' || !window.navigator.userAgent.includes('Electron')) {
    console.log("Skipping MQTT connection: not in Electron");
    return null;
  }

  client = mqtt.connect(MQTT_BROKER_URL);

  client.on('connect', () => {
    console.log('✅ MQTT connected');
    client?.subscribe('test/topic', (err) => {
      if (err) console.error('Failed to subscribe:', err);
    });
  });

  client.on('message', (topic, message) => {
    console.log(`📨 MQTT message received on ${topic}: ${message.toString()}`);
  });

  client.on('error', (err) => {
    console.error('MQTT error:', err);
  });

  return client;
};

export const publishMessage = (topic: string, message: string) => {
  if (client?.connected) {
    client.publish(topic, message);
  }
};
