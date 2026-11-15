// src/components/protosem/weeks/week7/code.ts
// Generated from the Forge_IOT repo sources (see gen script) — edit the repo files, not this file.

export const T1_SKETCH = `// Task 01 — ESP32 web server + HTML LED control
// Serves a control page from the board on port 80 and toggles the on-board LED (GPIO 2).
//
// NOTE: reconstructed from the portfolio write-up (handlers are the originals; the
// HTML page and handleRoot were filled in to match the screenshot). Re-flash and test
// on your board before relying on it.

#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "YOUR_WIFI_SSID";       // 2.4 GHz network only
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);
const int ledPin = 2;      // on-board blue LED

// The page lives in flash (PROGMEM). Changing a colour means re-flashing the board.
const char INDEX_HTML[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ESP32 LED Control</title>
  <style>
    body   { font-family: Arial, sans-serif; background: #f0f0f0; display: flex; justify-content: center; padding-top: 40px; }
    .card  { background: #fff; padding: 28px 36px; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,.12); text-align: center; }
    h1     { margin: 0 0 6px; font-size: 1.5rem; }
    p      { margin: 0 0 20px; font-size: .85rem; color: #444; }
    a      { text-decoration: none; }
    button { border: 0; color: #fff; font-size: 1rem; padding: 12px 34px; margin: 0 6px; border-radius: 6px; cursor: pointer; }
    .on    { background: #2e9e3f; }
    .off   { background: #e0401f; }
  </style>
</head>
<body>
  <div class="card">
    <h1>ESP32 LED Control</h1>
    <p>Control the ESP32 LED using HTTP</p>
    <a href="/ledon"><button class="on">ON</button></a>
    <a href="/ledoff"><button class="off">OFF</button></a>
  </div>
</body>
</html>
)rawliteral";

void handleRoot() {
  server.send(200, "text/html", INDEX_HTML);
}

void handleLEDOn() {
  digitalWrite(ledPin, HIGH);
  server.send(200, "text/html", "<h1>LED is ON</h1>");
  Serial.println("LED ON");
}

void handleLEDOff() {
  digitalWrite(ledPin, LOW);
  server.send(200, "text/html", "<h1>LED is OFF</h1>");
  Serial.println("LED OFF");
}

void handleNotFound() {
  server.send(404, "text/plain", "Not found");
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  // Station mode: join an existing router. The board's address is printed below.
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println();
  Serial.print("Open http://"); Serial.println(WiFi.localIP());

  // Alternative — soft access point: the board hosts its own network and is
  // reachable at 192.168.4.1 (the address in the portfolio screenshot).
  //   WiFi.softAP("ESP32-LED", "12345678");
  //   Serial.println(WiFi.softAPIP());

  server.on("/", handleRoot);          // serves the control page
  server.on("/ledon",  handleLEDOn);
  server.on("/ledoff", handleLEDOff);
  server.onNotFound(handleNotFound);
  server.begin();
}

void loop() {
  server.handleClient();
}`;

export const T1_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ESP32 LED Control</title>
  <style>
    body   { font-family: Arial, sans-serif; background: #f0f0f0; display: flex; justify-content: center; padding-top: 40px; }
    .card  { background: #fff; padding: 28px 36px; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,.12); text-align: center; }
    h1     { margin: 0 0 6px; font-size: 1.5rem; }
    p      { margin: 0 0 20px; font-size: .85rem; color: #444; }
    a      { text-decoration: none; }
    button { border: 0; color: #fff; font-size: 1rem; padding: 12px 34px; margin: 0 6px; border-radius: 6px; cursor: pointer; }
    .on    { background: #2e9e3f; }
    .off   { background: #e0401f; }
  </style>
</head>
<body>
  <div class="card">
    <h1>ESP32 LED Control</h1>
    <p>Control the ESP32 LED using HTTP</p>
    <a href="/ledon"><button class="on">ON</button></a>
    <a href="/ledoff"><button class="off">OFF</button></a>
  </div>
</body>
</html>`;

export const T2_SKETCH = `// Task 02 — Adafruit IO (MQTT) relay control
// Subscribes to the "esp" feed; "ON" / "OFF" published from anywhere drives the relay.
//
// Libraries: "Adafruit IO Arduino" (+ its dependencies: Adafruit MQTT, ArduinoHttpClient).
// Keep real credentials out of git — copy the file locally and fill them in there.

#include <AdafruitIO_WiFi.h>

#define WIFI_SSID   "YOUR_WIFI_SSID"
#define WIFI_PASS   "YOUR_WIFI_PASSWORD"
#define IO_USERNAME "YOUR_ADAFRUIT_IO_USERNAME"
#define IO_KEY      "YOUR_ADAFRUIT_IO_KEY"

AdafruitIO_WiFi io(IO_USERNAME, IO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *relayFeed = io.feed("esp");

#define RELAY_PIN 26

// Called whenever anything publishes to the feed, from anywhere.
void handleMessage(AdafruitIO_Data *data) {
  String command = data->toString();
  command.trim();
  command.toUpperCase();

  if (command == "ON")       digitalWrite(RELAY_PIN, HIGH);
  else if (command == "OFF") digitalWrite(RELAY_PIN, LOW);

  Serial.println("BULB -> " + command);
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  relayFeed->onMessage(handleMessage);
  io.connect();
  while (io.status() < AIO_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(io.statusText());

  relayFeed->get();   // pull the current state on reconnect
}

void loop() {
  io.run();           // keeps the MQTT connection alive
}`;

export const T4_FIRMWARE = `// Task 04 — ESP32 -> Firebase Realtime Database: live telemetry + manual bulb control
//
// RECONSTRUCTED from the portfolio write-up (pins, paths and intervals match it).
// It has not been compiled or flashed from this repo — treat it as a starting point.
//
// Libraries: "Firebase ESP Client" (Mobizt), "DHT sensor library" (Adafruit) + Adafruit Unified Sensor.

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <DHT.h>

#define WIFI_SSID      "YOUR_WIFI_SSID"
#define WIFI_PASSWORD  "YOUR_WIFI_PASSWORD"
#define API_KEY        "YOUR_FIREBASE_WEB_API_KEY"
#define DATABASE_URL   "https://YOUR-PROJECT-default-rtdb.firebaseio.com/"
#define USER_EMAIL     "device@example.com"      // a user created in Firebase Authentication
#define USER_PASSWORD  "YOUR_DEVICE_PASSWORD"    // the rules require auth != null

#define DHT_PIN    4
#define DHT_TYPE   DHT11
#define LDR_PIN    34
#define RELAY_PIN  26
#define SENSOR_INTERVAL 2000

DHT dht(DHT_PIN, DHT_TYPE);
FirebaseData fbdo;      // writes
FirebaseData stream;    // control stream (a stream needs its own object)
FirebaseAuth auth;
FirebaseConfig config;

bool relayState = false;
unsigned long lastPush = 0;

int readLDR() {                       // a bare LDR is noisy — average a short burst
  int sum = 0;
  for (int i = 0; i < 15; i++) { sum += analogRead(LDR_PIN); delay(8); }
  return sum / 15;
}

void applyRelay(bool state) {
  relayState = state;
  digitalWrite(RELAY_PIN, state ? LOW : HIGH);   // active-LOW module
}

void onControl(FirebaseStream data) {
  if (data.dataPath() == "/bulbState" && data.dataType() == "boolean") {
    applyRelay(data.boolData());
  }
}
void onStreamTimeout(bool timeout) { if (timeout) Serial.println("stream timeout, resuming..."); }

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  applyRelay(false);
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Firebase.RTDB.beginStream(&stream, "/appliances");
  Firebase.RTDB.setStreamCallback(&stream, onControl, onStreamTimeout);
}

void loop() {
  if (Firebase.ready() && millis() - lastPush >= SENSOR_INTERVAL) {
    lastPush = millis();

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    if (isnan(t) || isnan(h)) { Serial.println("DHT read failed"); return; }

    FirebaseJson json;
    json.set("temperature", t);
    json.set("humidity", h);
    json.set("ldr", readLDR());
    json.set("bulbState", relayState);
    json.set("timestamp/.sv", "timestamp");       // server-side time
    Firebase.RTDB.setJSON(&fbdo, "/live", &json); // overwritten each time: the "now" view
  }
}`;

export const T4_RULES = `{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "sensorData": { ".indexOn": ["timestamp"] }
  }
}`;

export const T4_AUTH_CONTEXT = `import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged, signInWithPopup, GoogleAuthProvider,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);   // true until Firebase has restored (or not) a session

  useEffect(() => onAuthStateChanged(auth, (user) => { setCurrentUser(user); setLoading(false); }), []);

  const value = {
    currentUser,
    googleLogin: () => signInWithPopup(auth, new GoogleAuthProvider()),
    emailLogin: (email, pw) => signInWithEmailAndPassword(auth, email, pw),
    emailSignup: (email, pw) => createUserWithEmailAndPassword(auth, email, pw),
    logout: () => signOut(auth),
  };
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}`;

export const T4_GUARD = `// The whole access-control surface of the dashboard, in six lines.
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
}`;

export const T4_LOGIN = `import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { currentUser, googleLogin, emailLogin, emailSignup } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  if (currentUser) return <Navigate to="/dashboard" replace />;

  const run = (fn) => async (e) => {
    e?.preventDefault();
    setError("");
    try { await fn(); } catch (err) { setError(err.code || err.message); }
  };

  return (
    <main className="card narrow">
      <h1>Forge IoT Monitor</h1>
      <p className="muted">Sign in to view and control the device.</p>
      <form onSubmit={run(() => emailLogin(email, pw))}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        <button type="submit">Sign in</button>
        <button type="button" className="ghost" onClick={run(() => emailSignup(email, pw))}>Create account</button>
      </form>
      <button className="ghost" onClick={run(googleLogin)}>Continue with Google</button>
      {error && <p className="error" role="alert">{error}</p>}
    </main>
  );
}`;

export const T4_DASHBOARD = `import { useEffect, useState } from "react";
import { ref, onValue, set, get, query, limitToLast } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import HistoryChart from "../components/HistoryChart";
import { downloadCsv } from "../utils/csv";
import { publishBulb } from "../utils/adafruit";

const HISTORY_SIZE = 60;

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [records, setRecords] = useState([]);                    // newest last
  const [bulbOn, setBulbOn] = useState(false);
  const [mode, setMode] = useState("manual");
  const [threshold, setThreshold] = useState(2500);
  const [note, setNote] = useState("");

  useEffect(() => {
    const offs = [
      onValue(query(ref(db, "sensorData"), limitToLast(HISTORY_SIZE)), (s) => setRecords(Object.values(s.val() ?? {}))),
      onValue(ref(db, "appliances/bulbState"), (s) => setBulbOn(!!s.val())),
      onValue(ref(db, "settings/mode"), (s) => setMode(s.val() ?? "manual")),
      onValue(ref(db, "settings/ldrThreshold"), (s) => setThreshold(s.val() ?? 2500)),
    ];
    return () => offs.forEach((off) => off());                   // detach every listener
  }, []);

  const latest = records[records.length - 1];
  const auto = mode === "automatic";

  const toggleBulb = async () => {
    const next = !bulbOn;
    await set(ref(db, "appliances/bulbState"), next);            // the ESP32 streams this path
    try { await publishBulb(next); } catch (e) { setNote(\`Adafruit IO: \${e.message}\`); }
  };

  const exportCsv = async () => {                                // the full history, not just the visible window
    const snap = await get(ref(db, "sensorData"));
    const all = Object.values(snap.val() ?? {}).sort((a, b) => a.timestamp - b.timestamp);
    downloadCsv(all, \`sensor_log_\${new Date().toISOString().slice(0, 10)}.csv\`);
  };

  return (
    <main className="card">
      <header className="bar">
        <h1>IoT Monitor</h1>
        <span className="muted">{currentUser.email} · <button className="link" onClick={logout}>Sign out</button></span>
      </header>

      <section className="tiles">
        <Tile label="Temperature" value={latest ? \`\${Number(latest.temperature).toFixed(1)} °C\` : "—"} />
        <Tile label="Humidity" value={latest ? \`\${Number(latest.humidity).toFixed(0)} %\` : "—"} />
        <Tile label="Light (ADC)" value={latest ? latest.ldr : "—"} />
        <Tile label="Bulb" value={bulbOn ? "ON" : "OFF"} />
      </section>

      <section className="controls">
        <button onClick={toggleBulb} disabled={auto} title={auto ? "Disabled in automatic mode" : ""}>
          Turn bulb {bulbOn ? "OFF" : "ON"}
        </button>
        <button className="ghost" onClick={() => set(ref(db, "settings/mode"), auto ? "manual" : "automatic")}>
          Mode: {auto ? "Automatic" : "Manual"}
        </button>
        <label>LDR threshold
          <input type="number" min="0" max="4095" value={threshold}
                 onChange={(e) => setThreshold(e.target.value)}
                 onBlur={() => set(ref(db, "settings/ldrThreshold"), Number(threshold))} />
        </label>
        <button className="ghost" onClick={exportCsv}>Download CSV</button>
      </section>
      {note && <p className="error">{note}</p>}

      <h2>History</h2>
      <HistoryChart records={records} />
      <table>
        <thead><tr><th>Time</th><th>Temp</th><th>Hum</th><th>Light</th><th>Bulb</th><th>Mode</th></tr></thead>
        <tbody>
          {[...records].reverse().slice(0, 10).map((r) => (
            <tr key={r.timestamp}>
              <td>{new Date(r.timestamp).toLocaleString()}</td><td>{r.temperature}</td><td>{r.humidity}</td>
              <td>{r.ldr}</td><td>{r.bulbState ? "ON" : "OFF"}</td><td>{r.mode ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const Tile = ({ label, value }) => (
  <div className="tile"><span className="muted">{label}</span><strong>{value}</strong></div>
);`;

export const T4_CHART = `// Dependency-free SVG line chart: each series is scaled to its own min/max so
// temperature (~27), humidity (~60) and light (0-4095) can share one plot.
const SERIES = [
  { key: "temperature", label: "Temperature °C", color: "#1E8E5A" },
  { key: "humidity", label: "Humidity %", color: "#2A6CF0" },
  { key: "ldr", label: "Light (ADC)", color: "#C98512" },
];
const W = 760, H = 220, PAD = 12;

export default function HistoryChart({ records }) {
  if (records.length < 2) return <p className="muted">Waiting for more readings…</p>;
  const x = (i) => PAD + (i / (records.length - 1)) * (W - 2 * PAD);
  const line = (key) => {
    const vals = records.map((r) => Number(r[key]));
    const min = Math.min(...vals), max = Math.max(...vals), span = max - min || 1;
    return vals.map((v, i) => \`\${x(i)},\${H - PAD - ((v - min) / span) * (H - 2 * PAD)}\`).join(" ");
  };
  return (
    <figure>
      <svg viewBox={\`0 0 \${W} \${H}\`} role="img" aria-label="Sensor history chart" style={{ width: "100%" }}>
        {SERIES.map((s) => <polyline key={s.key} points={line(s.key)} fill="none" stroke={s.color} strokeWidth="2" />)}
      </svg>
      <figcaption className="legend">
        {SERIES.map((s) => <span key={s.key}><i style={{ background: s.color }} />{s.label}</span>)}
      </figcaption>
    </figure>
  );
}`;

export const T5_FIRMWARE = `// Task 05 — Automatic / manual bulb control + historical logging to Firebase
//
// RECONSTRUCTED around the loop() published in the portfolio write-up. Differences from
// that excerpt, on purpose: the control stream uses its own FirebaseData object, and each
// log record also stores the operating mode. Not compiled from this repo — verify on hardware.
//
// Libraries: "Firebase ESP Client" (Mobizt), "DHT sensor library" (Adafruit) + Adafruit Unified Sensor.

#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>
#include <DHT.h>

#define WIFI_SSID      "YOUR_WIFI_SSID"
#define WIFI_PASSWORD  "YOUR_WIFI_PASSWORD"
#define API_KEY        "YOUR_FIREBASE_WEB_API_KEY"
#define DATABASE_URL   "https://YOUR-PROJECT-default-rtdb.firebaseio.com/"
#define USER_EMAIL     "device@example.com"
#define USER_PASSWORD  "YOUR_DEVICE_PASSWORD"

#define DHT_PIN    4
#define DHT_TYPE   DHT11
#define LDR_PIN    34
#define RELAY_PIN  26
#define SENSOR_INTERVAL 2000

DHT dht(DHT_PIN, DHT_TYPE);
FirebaseData fbdo;      // writes
FirebaseData stream;    // reads the control paths over an open stream
FirebaseAuth auth;
FirebaseConfig config;

int  ldrThreshold = 2500;      // overwritten from /settings/ldrThreshold
bool relayState   = false;
String mode       = "manual";  // "manual" | "automatic"
unsigned long lastPush = 0;

// A bare LDR reading is noisy; average a short burst instead.
int readLDR() {
  int sum = 0;
  for (int i = 0; i < 15; i++) { sum += analogRead(LDR_PIN); delay(8); }
  return sum / 15;
}

void applyRelay(bool state) {
  relayState = state;
  digitalWrite(RELAY_PIN, state ? LOW : HIGH);   // active-LOW module
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  applyRelay(false);
  dht.begin();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(WiFi.localIP());

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Stream the whole tree; loop() reacts only to the three control paths.
  Firebase.RTDB.beginStream(&stream, "/");
}

void loop() {
  if (!Firebase.ready()) return;

  // Control changes arrive over an open stream — no polling.
  if (Firebase.RTDB.readStream(&stream) && stream.streamAvailable()) {
    if (stream.dataPath() == "/appliances/bulbState" && mode == "manual") {
      applyRelay(stream.to<bool>());
    }
    if (stream.dataPath() == "/settings/mode")         mode = stream.to<String>();
    if (stream.dataPath() == "/settings/ldrThreshold") ldrThreshold = stream.to<int>();
  }

  if (millis() - lastPush >= SENSOR_INTERVAL) {
    lastPush = millis();

    float temperature = dht.readTemperature();
    float humidity    = dht.readHumidity();
    int   light       = readLDR();
    if (isnan(temperature) || isnan(humidity)) { Serial.println("DHT read failed"); return; }

    if (mode == "automatic") {
      bool shouldBeOn = (light > ldrThreshold);       // higher reading = darker room
      if (shouldBeOn != relayState) {
        applyRelay(shouldBeOn);
        // Write back so the dashboard reflects reality.
        Firebase.RTDB.setBool(&fbdo, "/appliances/bulbState", relayState);
      }
    }

    FirebaseJson json;
    json.set("temperature", temperature);
    json.set("humidity", humidity);
    json.set("ldr", light);
    json.set("bulbState", relayState);
    json.set("mode", mode);
    json.set("timestamp/.sv", "timestamp");
    Firebase.RTDB.pushJSON(&fbdo, "/sensorData", &json);   // append-only history
  }
}`;

export const T5_CSV_UTIL = `// Turn the logged records into a CSV file and hand it to the browser as a download.
const HEADER = ["timestamp", "datetime", "temperature_c", "humidity_pct", "ldr_adc", "bulb_state", "mode"];

export function recordsToCsv(records) {
  const rows = records.map((r) => [
    r.timestamp,
    new Date(r.timestamp).toISOString(),
    r.temperature,
    r.humidity,
    r.ldr,
    r.bulbState ? "ON" : "OFF",
    r.mode ?? "",
  ]);
  return [HEADER, ...rows].map((row) => row.join(",")).join("\\n");
}

export function downloadCsv(records, filename = "sensor_log.csv") {
  const blob = new Blob([recordsToCsv(records)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}`;

export const T4_ADAFRUIT = `// Task 2 path: also publish the bulb command to the Adafruit IO "bulb" feed.
// The key is an account-wide master key and VITE_* values are readable in the browser —
// the server-side version (Cloud Function with a secret) is in ../../README.md.
const USER = import.meta.env.VITE_AIO_USERNAME;
const KEY = import.meta.env.VITE_AIO_KEY;

export async function publishBulb(state) {
  if (!USER || !KEY) return;                       // not configured: Firebase-only
  const res = await fetch(\`https://io.adafruit.com/api/v2/\${USER}/feeds/bulb/data\`, {
    method: "POST",
    headers: { "X-AIO-Key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ value: state ? "ON" : "OFF" }),
  });
  if (!res.ok) throw new Error(await res.text());
}`;

export const SECRET_CODE = `// The version that keeps the key server-side. The browser calls this;
// only the function ever sees the credential.
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

const AIO_USERNAME = defineSecret("ADAFRUIT_IO_USERNAME");
const AIO_KEY      = defineSecret("ADAFRUIT_IO_KEY");

export const toggleBulb = onCall(
  { secrets: [AIO_USERNAME, AIO_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be signed in.");
    }

    const state = request.data?.state;
    if (state !== "ON" && state !== "OFF") {
      throw new HttpsError("invalid-argument", "state must be 'ON' or 'OFF'.");
    }

    const res = await fetch(
      \`https://io.adafruit.com/api/v2/\${AIO_USERNAME.value()}/feeds/bulb/data\`,
      {
        method: "POST",
        headers: { "X-AIO-Key": AIO_KEY.value(), "Content-Type": "application/json" },
        body: JSON.stringify({ value: state }),
      }
    );

    if (!res.ok) throw new HttpsError("internal", await res.text());
    return { success: true, state };
  }
);`;
