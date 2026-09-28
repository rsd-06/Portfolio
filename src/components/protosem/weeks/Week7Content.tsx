"use client";

// src/components/protosem/weeks/Week7Content.tsx
// Week 7 — IoT & Embedded Systems.
// A four-task smart-home build on the ESP32, each task adding one layer:
// local HTTP -> cloud MQTT -> voice triggers -> full-stack sensor platform.

import {
  WeekShell,
  WeekSection,
  Prose,
  Term,
  ArrowList,
  Callout,
  CardGrid,
  ChipRow,
  VideoFigure,
  Gallery,
  CodeBlock,
  SpecList,
  Pipeline,
  StatRow,
} from "./blocks";

const ASSETS = "/assets/protoSemPage/week7";

const TASK1_CODE = `#include <WiFi.h>
#include <WebServer.h>

const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

WebServer server(80);
const int ledPin = 2;      // on-board blue LED

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

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);          // serves the control page
  server.on("/ledon",  handleLEDOn);
  server.on("/ledoff", handleLEDOff);
  server.begin();
}

void loop() {
  server.handleClient();
}`;

const TASK2_CODE = `#include <AdafruitIO_WiFi.h>

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

  relayFeed->get();   // pull the current state on reconnect
}

void loop() {
  io.run();           // keeps the MQTT connection alive
}`;

const TASK4_CODE = `#define DHT_PIN    4
#define LDR_PIN    34
#define RELAY_PIN  26
#define SENSOR_INTERVAL 2000

int  ldrThreshold = 2500;
bool relayState   = false;
String mode       = "manual";

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

void loop() {
  // Control changes arrive over an open stream — no polling.
  if (Firebase.RTDB.readStream(&fbdo) && fbdo.streamAvailable()) {
    if (fbdo.dataPath() == "/appliances/bulbState" && mode == "manual") {
      applyRelay(fbdo.to<bool>());
    }
    if (fbdo.dataPath() == "/settings/mode")         mode = fbdo.to<String>();
    if (fbdo.dataPath() == "/settings/ldrThreshold") ldrThreshold = fbdo.to<int>();
  }

  if (millis() - lastPush >= SENSOR_INTERVAL) {
    lastPush = millis();

    float temperature = dht.readTemperature();
    float humidity    = dht.readHumidity();
    int   light       = readLDR();

    if (mode == "automatic") {
      bool shouldBeOn = (light > ldrThreshold);
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
    json.set("timestamp/.sv", "timestamp");
    Firebase.RTDB.pushJSON(&fbdo, "/sensorData", &json);
  }
}`;

const GUARD_CODE = `// The whole access-control surface of the dashboard, in six lines.
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { currentUser } = useAuth();
  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
}`;

const SECRET_CODE = `// The version that keeps the key server-side. The browser calls this;
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

export default function Week7Content() {
  return (
    <WeekShell
      slug="week-7"
      subtitle="Four tasks, one system — from a light switch on the local network to a sensor-driven dashboard in the cloud."
    >
      {/* ── Overview ─────────────────────────────────────────── */}
      <WeekSection eyebrow="OVERVIEW" id="overview" title="The Week in One Line">
        <Prose>
          Week 7 was the hardware week. The brief was to build a working smart-home
          system on an <Term>ESP32</Term>, but the point was not the finished gadget —
          it was the progression. Each task kept the same physical outcome (a light
          turning on) and changed only the path the command travelled. By the end, the
          same relay could be driven from a browser on the same Wi-Fi, from a dashboard
          on the other side of the internet, from a spoken sentence, or by the room
          deciding for itself that it had got dark.
        </Prose>
        <Prose className="mt-4">
          Holding the outcome constant while varying the architecture is what made the
          trade-offs legible. HTTP is immediate but trapped on the local network. MQTT
          escapes the network but introduces a broker you do not own. Voice adds
          delightful ergonomics and two seconds of latency. A full-stack backend gives
          you history and autonomy, and a great deal more to maintain.
        </Prose>

        <StatRow
          items={[
            { value: "3", label: "Days" },
            { value: "4", label: "Tasks" },
            { value: "3", label: "Cloud services" },
            { value: "230V", label: "Live load switched" },
          ]}
        />
      </WeekSection>

      {/* ── Task 1 ───────────────────────────────────────────── */}
      <WeekSection eyebrow="TASK 01 · DAY 1" id="http" title="Local Control over HTTP">
        <Prose>
          The first task put a web server on the microcontroller itself. The ESP32
          brings up Wi-Fi, listens on port 80, and serves a small control page straight
          from program memory — no SD card, no separate front-end host. Two endpoints
          toggle <Term>GPIO 2</Term>, which is wired on-board to the blue LED, so no
          external circuit is needed at all.
        </Prose>
        <Prose className="mt-4">
          Serving the interface from the board is the detail worth dwelling on. The page
          and the thing it controls are the same device, so there is no deployment step
          and nothing to keep in sync — but the HTML lives inside the firmware, which
          means changing a button colour means reflashing the board.
        </Prose>

        <ArrowList
          label="WHAT I BUILT"
          items={[
            <>
              Wi-Fi bring-up with <Term>WiFi.h</Term>, then a <Term>WebServer</Term>{" "}
              instance on port 80
            </>,
            <>An HTML control page held in memory and returned by the root handler</>,
            <>Two routes — one for on, one for off — each writing to the LED pin</>,
            <>
              Serial logging at 115200 baud to confirm the assigned address and each
              state change
            </>,
          ]}
        />

        <SpecList
          items={[
            { name: "ESP32 DevKit", qty: "1", role: "Main microcontroller — Wi-Fi and GPIO" },
            { name: "Micro-USB cable", qty: "1", role: "Power and serial upload (must be a data cable)" },
            { name: "On-board LED", qty: "GPIO 2", role: "The load — already wired on the board" },
            { name: "2.4 GHz Wi-Fi", qty: "—", role: "ESP32 radios do not join 5 GHz networks" },
          ]}
        />

        <Pipeline
          steps={[
            {
              title: "Add ESP32 board support",
              meta: "Arduino IDE",
              body: "Install the ESP32 core through the Boards Manager, then select ESP32 Dev Module and the right COM port.",
            },
            {
              title: "Flash the firmware",
              meta: "Upload",
              body: "Paste the sketch, set the Wi-Fi credentials, and upload. The board hard-resets over the RTS pin once the write is verified.",
            },
            {
              title: "Find the address",
              meta: "Serial Monitor · 115200",
              body: "Open the Serial Monitor and note the address the board reports once it is on the network.",
            },
            {
              title: "Drive it from a browser",
              meta: "Any device on the same network",
              body: "Open that address and use the control page — or hit the endpoints directly to confirm the routes independently of the UI.",
            },
          ]}
        />

        <CodeBlock filename="task1_led_web_control.ino">{TASK1_CODE}</CodeBlock>

        <Gallery
          columns={3}
          items={[
            {
              src: `${ASSETS}/arduino-upload.jpeg`,
              alt: "Arduino IDE showing the handleLEDOn function and a verified firmware upload",
              caption: "Flashing the sketch — write verified, board resetting over RTS.",
              aspect: "3/4",
              fit: "cover",
            },
            {
              src: `${ASSETS}/web-ui-control.jpeg`,
              alt: "Browser showing the ESP32 LED Control page with ON and OFF buttons",
              caption: "The control page, served by the board itself.",
              aspect: "3/4",
              fit: "cover",
            },
            {
              src: `${ASSETS}/esp32-led-on.jpeg`,
              alt: "ESP32 development board with its blue on-board LED lit",
              caption: "GPIO 2 high — the result at the other end of the request.",
              aspect: "3/4",
              fit: "cover",
            },
          ]}
        />

        <VideoFigure
          src={`${ASSETS}/demo-led-web.mp4`}
          poster={`${ASSETS}/demo-led-web-poster.jpg`}
          caption="Demo — pressing ON and OFF in the browser, with the board responding in real time."
          maxWidth="380px"
        />
      </WeekSection>

      {/* ── Task 2 ───────────────────────────────────────────── */}
      <WeekSection eyebrow="TASK 02 · DAY 2" id="mqtt" title="Off the Local Network with MQTT">
        <Prose>
          Task 1 only works if you are standing on the same Wi-Fi. Task 2 removed that
          limit by switching from request–response to <Term>publish–subscribe</Term>.
          The board opens a long-lived connection to an <Term>Adafruit IO</Term> broker
          and subscribes to a feed. Anything published to that feed — from a dashboard,
          a script, a phone anywhere in the world — arrives at the board almost
          immediately.
        </Prose>
        <Prose className="mt-4">
          The inversion is the whole idea. With HTTP the device waits to be reached,
          which means it must be reachable — a public address, port forwarding, or a
          tunnel. With MQTT the device reaches <em>out</em> and holds the connection
          open, so it works from behind any home router without exposing anything.
        </Prose>
        <Prose className="mt-4">
          The load also changed. Instead of a 3.3V LED, the output drove a relay
          switching a mains incandescent bulb, with the relay module providing isolation
          between the low-voltage control side and the mains side.
        </Prose>

        <ChipRow
          items={[
            { icon: "📡", label: "MQTT", description: "Lightweight pub/sub for constrained devices" },
            { icon: "☁️", label: "Adafruit IO", description: "Hosted broker + dashboard" },
            { icon: "🔌", label: "Relay module", description: "Isolated switching of the mains load" },
            { icon: "💡", label: "230V bulb", description: "The visible result" },
          ]}
        />

        <Callout label="SAFETY — MAINS WIRING">
          This is the point in the week where a mistake stops being a compile error.
          Everything was wired and re-checked with the circuit unplugged, the relay
          switched only the live conductor, and the low-voltage and mains sides were
          kept physically apart. The relay is what makes a 3.3V pin capable of
          controlling a mains load safely — the microcontroller never touches it.
        </Callout>

        <CodeBlock filename="task2_mqtt_relay.ino">{TASK2_CODE}</CodeBlock>

        <VideoFigure
          src={`${ASSETS}/demo-relay-bulb.mp4`}
          poster={`${ASSETS}/demo-relay-bulb-poster.jpg`}
          caption="Lab setup — relay, breadboard and the mains bulb being switched from the cloud dashboard."
          maxWidth="720px"
        />
      </WeekSection>

      {/* ── Task 3 ───────────────────────────────────────────── */}
      <WeekSection eyebrow="TASK 03 · DAY 3" id="voice" title="A Voice Layer on Top">
        <Prose>
          Task 3 added no firmware at all — and that was the lesson. Because Task 2
          already listened to a feed, any new way of writing to that feed becomes a new
          way of controlling the bulb. An <Term>IFTTT</Term> applet links a spoken
          trigger phrase to a webhook that posts to the same Adafruit IO feed, and the
          firmware from Task 2 handles it without a single line changed.
        </Prose>
        <Prose className="mt-4">
          That is what a good integration seam looks like: the feed is the contract, and
          everything on either side of it can be replaced independently.
        </Prose>

        <Pipeline
          steps={[
            {
              title: "Spoken phrase",
              meta: "Voice assistant",
              body: "A trigger phrase is recognised and matched to an intent.",
            },
            {
              title: "Applet fires",
              meta: "IFTTT",
              body: "The matched intent triggers an applet configured against the assistant service.",
            },
            {
              title: "Webhook posts",
              meta: "HTTP POST",
              body: "The applet sends a request carrying the desired value to the feed's REST endpoint.",
            },
            {
              title: "Broker republishes",
              meta: "Adafruit IO",
              body: "The feed updates and pushes the new value to every subscriber.",
            },
            {
              title: "Board reacts",
              meta: "ESP32",
              body: "The same onMessage handler from Task 2 parses the command and drives the relay pin.",
            },
            {
              title: "Bulb responds",
              meta: "~2–3s end to end",
              body: "The relay closes and the light comes on — noticeably slower than the local path, and worth it for the ergonomics.",
            },
          ]}
        />
      </WeekSection>

      {/* ── Task 4 ───────────────────────────────────────────── */}
      <WeekSection eyebrow="TASK 04" id="fullstack" title="The Full-Stack Build">
        <Prose>
          The final task pulled the previous three into one system with three layers: a
          hardware layer that senses and actuates, a cloud layer that stores and
          synchronises state, and a web dashboard for people to actually use. Control
          stopped being one-directional — the device now reports as much as it receives.
        </Prose>
        <Prose className="mt-4">
          A <Term>DHT11</Term> supplies temperature and humidity, and an <Term>LDR</Term>{" "}
          reads ambient light on an analog pin. Every couple of seconds the board takes a
          reading, averages the light samples to damp the noise a bare photoresistor
          produces, and pushes the result to <Term>Firebase Realtime Database</Term>. It
          also holds open a stream on the control paths, so a change made in the
          dashboard reaches the device without polling.
        </Prose>

        <CardGrid
          columns={3}
          items={[
            {
              icon: "🔧",
              title: "Hardware",
              subtitle: "ESP32 · DHT11 · LDR",
              body: "Reads temperature, humidity and light on a fixed interval; drives the relay; listens for control changes.",
            },
            {
              icon: "☁️",
              title: "Cloud",
              subtitle: "Firebase RTDB + Auth",
              body: "Single source of truth for device state and history, with sign-in so the dashboard is not open to the world.",
            },
            {
              icon: "🖥️",
              title: "Dashboard",
              subtitle: "Web client",
              body: "Live telemetry, a manual toggle, a manual/automatic switch, a threshold control and a CSV export.",
            },
          ]}
        />

        <Prose className="mt-8">
          The mode switch is where it stops being a remote control and starts being
          automation. In <Term>manual</Term> mode the relay follows the dashboard. In{" "}
          <Term>automatic</Term> mode the board compares the smoothed light reading
          against a threshold and decides for itself, writing the resulting state back to
          the database so the dashboard stays truthful about what the hardware is
          actually doing.
        </Prose>

        <CodeBlock filename="task4_forge_hardware.ino">{TASK4_CODE}</CodeBlock>

        <Prose className="mt-6">
          Because every reading is appended with a server timestamp, the database doubles
          as a history. The dashboard reads that history back and writes it out as CSV,
          which is the small feature that turns a demo into something you can actually
          ask questions of — how warm the room gets, how often the light triggers,
          whether the threshold is set sensibly.
        </Prose>
      </WeekSection>

      {/* ── Auth & secrets ───────────────────────────────────── */}
      <WeekSection
        eyebrow="TASK 04 · CONTINUED"
        id="auth"
        title="Auth, and the Key That Couldn&rsquo;t Ship"
      >
        <Prose>
          A dashboard that switches a real appliance should not be open to whoever
          finds the URL, so the next layer was authentication. Firebase handles both
          Google sign-in and email/password, an auth context tracks the session
          app-wide via <Term>onAuthStateChanged</Term>, and a single route guard keeps
          the logic in one place instead of scattering checks through the pages.
        </Prose>

        <CodeBlock filename="ProtectedRoute.jsx">{GUARD_CODE}</CodeBlock>

        <Prose className="mt-6">
          The more interesting problem came next, and it is the one I actually learned
          the most from. Controlling the bulb from the dashboard means calling the
          Adafruit IO API, which needs the account key. The obvious move is to put that
          key in the front-end and call the API directly from the browser.
        </Prose>
        <Prose className="mt-4">
          That is a bad idea, and the reason is worth being precise about. Adafruit&rsquo;s
          key is an <Term>account-wide master key</Term>, not a credential scoped to one
          feed. Anything shipped to the browser is readable — open the network tab and
          it is right there. So exposing it would not just let a stranger toggle a bulb;
          it would hand them read and write access to every feed on the account. The
          blast radius is the whole account, not the one device.
        </Prose>

        <ArrowList
          label="THE CORRECT SHAPE"
          items={[
            <>The credential lives in a secret store, never in the repo and never in the bundle</>,
            <>A server-side function holds it and is the only thing that talks to the API</>,
            <>The browser calls that function, which rejects unauthenticated callers</>,
            <>The function validates the payload before forwarding anything</>,
          ]}
        />

        <CodeBlock filename="functions/src/index.ts">{SECRET_CODE}</CodeBlock>

        <Prose className="mt-6">
          Then reality intervened. Cloud Functions can only make outbound calls to
          non-Google services on the paid plan, and the billing upgrade would not go
          through — a known regional payment issue, not something I could code around.
          The secure design was written, correct, and unshippable.
        </Prose>

        <Callout label="THE TRADE-OFF I ACTUALLY MADE">
          Rather than stall, I moved the calls back into the browser with the key in an
          environment variable — accepting the exact exposure described above, with eyes
          open. What makes that defensible is the scope: a hobby feed, on a throwaway
          account, controlling one bulb, with nothing else of value behind the same
          credential. What makes it temporary is that the server-side version already
          exists; restoring it is a change to two imports once billing clears.
          <br />
          <br />
          The lesson was not &ldquo;never put keys in the client&rdquo; — I already knew that
          rule. It was that the rule is a shorthand for a threat model, and when you
          actually work the threat model through, you can tell the difference between a
          risk you must not take and one you can take deliberately, cheaply reverse, and
          write down.
        </Callout>
      </WeekSection>

      {/* ── Comparison ───────────────────────────────────────── */}
      <WeekSection eyebrow="SYNTHESIS" id="comparison" title="Four Paths to the Same Light">
        <Prose>
          Laid side by side, the four tasks are a decision table. None is strictly better
          — each buys something and gives something up.
        </Prose>

        <CardGrid
          columns={2}
          items={[
            {
              icon: "①",
              title: "Local HTTP",
              subtitle: "Same network · well under a second",
              body: "Fastest and fully self-contained — no accounts, no broker, no dependency. Useless the moment you leave the building.",
            },
            {
              icon: "②",
              title: "Cloud MQTT",
              subtitle: "Anywhere · around a second",
              body: "Works from any network without exposing the device. Costs you a dependency on a broker you do not control.",
            },
            {
              icon: "③",
              title: "Voice",
              subtitle: "Anywhere · two to three seconds",
              body: "The best ergonomics of the four and zero new firmware. The slowest path, and it fails if any link in the chain is down.",
            },
            {
              icon: "④",
              title: "Full-stack",
              subtitle: "Anywhere · bidirectional",
              body: "History, authentication and autonomous behaviour. Also the most moving parts and the most to keep running.",
            },
          ]}
        />
      </WeekSection>

      {/* ── Reflection ───────────────────────────────────────── */}
      <WeekSection eyebrow="REFLECTION" id="reflection" title="What Stuck">
        <Prose>
          The week reframed what I think &ldquo;IoT&rdquo; actually means. Very little of
          the difficulty was in the embedded code — the sketches are short, and the
          hardware is forgiving. The difficulty is in the seams: what happens when Wi-Fi
          drops mid-command, what the dashboard shows when the device has decided
          something on its own, who is allowed to write to the feed.
        </Prose>
        <Prose className="mt-4">
          The moment it clicked was Task 3. Adding voice control required no firmware
          change at all, because Task 2 had already drawn the boundary in the right
          place. Choosing where the contract lives turned out to matter far more than any
          individual implementation on either side of it — and that lesson applies well
          beyond microcontrollers.
        </Prose>

        <Callout label="TAKEAWAY">
          Holding the outcome fixed and varying the architecture is a genuinely good way
          to learn a domain. Four times over, the bulb lit — and each time it taught
          something different about latency, reach, dependency and trust.
          <span
            className="f-mono block mt-4"
            style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}
          >
            — Sudharshan R · Week 7, ProtoSem
          </span>
        </Callout>
      </WeekSection>
    </WeekShell>
  );
}
