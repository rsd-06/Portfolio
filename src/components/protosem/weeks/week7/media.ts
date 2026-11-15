// src/components/protosem/weeks/week7/media.ts
// Image paths + aspect ratios for the Week 7 page. Diagrams are generated, photos are the originals.

const BASE = "/assets/protoSemPage/week7";

export const DIAGRAMS = {
  t1Flow: { src: `${BASE}/diagrams/t1-flow.png`, aspect: "1000/560" },
  t1Wiring: { src: `${BASE}/diagrams/t1-wiring.png`, aspect: "1000/430" },
  t2DashboardLayout: { src: `${BASE}/diagrams/t2-dashboard-layout.png`, aspect: "1000/520" },
  t2Mqtt: { src: `${BASE}/diagrams/t2-mqtt.png`, aspect: "1000/470" },
  t2Wiring: { src: `${BASE}/diagrams/t2-wiring.png`, aspect: "1000/560" },
  t3Applet: { src: `${BASE}/diagrams/t3-applet.png`, aspect: "1000/470" },
  t3Flow: { src: `${BASE}/diagrams/t3-flow.png`, aspect: "1000/640" },
  t4Architecture: { src: `${BASE}/diagrams/t4-architecture.png`, aspect: "1000/600" },
  t4AuthFlow: { src: `${BASE}/diagrams/t4-auth-flow.png`, aspect: "1000/430" },
  t4DashboardLayout: { src: `${BASE}/diagrams/t4-dashboard-layout.png`, aspect: "1000/680" },
  t4Dbtree: { src: `${BASE}/diagrams/t4-dbtree.png`, aspect: "1000/640" },
  t5Automation: { src: `${BASE}/diagrams/t5-automation.png`, aspect: "1000/720" },
  t5DashboardLayout: { src: `${BASE}/diagrams/t5-dashboard-layout.png`, aspect: "1000/680" },
  t5LdrThreshold: { src: `${BASE}/diagrams/t5-ldr-threshold.png`, aspect: "1000/400" },
  t5Logging: { src: `${BASE}/diagrams/t5-logging.png`, aspect: "1000/520" },
  t5Wiring: { src: `${BASE}/diagrams/t5-wiring.png`, aspect: "1000/640" },
} as const;

export const PHOTOS = {
  arduinoUpload: `${BASE}/arduino-upload.jpeg`,
  webUi: `${BASE}/web-ui-control.jpeg`,
  esp32On: `${BASE}/esp32-led-on.jpeg`,
  labPoster: `${BASE}/demo-relay-bulb-poster.jpg`,
  bulbOn: `${BASE}/bulb-on.jpg`,
  bulbOff: `${BASE}/bulb-off.jpg`,
} as const;

export const VIDEOS = {
  ledWeb: { src: `${BASE}/demo-led-web.mp4`, poster: `${BASE}/demo-led-web-poster.jpg` },
  relayBulb: { src: `${BASE}/demo-relay-bulb.mp4`, poster: `${BASE}/demo-relay-bulb-poster.jpg` },
} as const;

export const REPO = "https://github.com/rsd-06/Forge_IOT";
