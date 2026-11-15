"use client";

// src/components/protosem/weeks/week7/Task1.tsx
// Task 01 — ESP32 Web Server & HTML LED Control.

import { Globe, Server, FileCode2, Wifi } from "lucide-react";
import {
  WeekSection, Prose, Term, ArrowList, Callout, CardGrid, ChipRow, CodeBlock, SpecList, Pipeline,
} from "../blocks";
import { Sub, Diagram, ProblemList, CollapsibleCode, RepoFiles, PinTable } from "./blocks";
import { DIAGRAMS, PHOTOS, VIDEOS } from "./media";
import { MediaWall } from "./MediaWall";
import { T1_SKETCH, T1_HTML } from "./code";

export default function Task1() {
  return (
    <WeekSection eyebrow="TASK 01 · DAY 1" id="task-1" title="ESP32 Web Server & HTML LED Control">
      <Sub>Objective & the problem it addresses</Sub>
      <Prose>
        The objective was to put a <Term>web server on the microcontroller itself</Term> and use an ordinary
        browser as the remote control for an LED. The problem being solved is the oldest one in embedded work: a
        bare microcontroller has no screen and no buttons, so every change of behaviour means plugging in a cable
        and re-flashing. If the board can serve a web page, any phone or laptop on the same network becomes its
        user interface — nothing to install on the client, and nothing to wire except power.
      </Prose>
      <Prose className="mt-4">
        Serving the page from the board is the detail worth dwelling on. The page and the thing it controls are the
        same device, so there is no deployment step and nothing to keep in sync — but the HTML lives inside the
        firmware, which means changing a button colour means reflashing the board.
      </Prose>

      <Sub>Basic concept of an ESP32 web server</Sub>
      <Prose>
        A web server is a program that listens on a network port and answers HTTP requests. On a laptop that
        program is Apache or Node; on the ESP32 it is the <Term>WebServer</Term> library running inside the
        firmware, alongside <Term>setup()</Term> and <Term>loop()</Term>. It registers a <em>route</em> (a URL path)
        against a <em>handler</em> (a function), then calls <code>server.handleClient()</code> in every pass of{" "}
        <code>loop()</code> to check whether a browser has asked for anything.
      </Prose>
      <CardGrid
        columns={2}
        items={[
          {
            icon: <Server size={22} />,
            title: "HTTP server",
            subtitle: "Port 80 · TCP",
            body: "Listens for requests such as GET /ledon and replies with a status code and a body. Port 80 is the default, so the browser needs no port number in the address.",
          },
          {
            icon: <Globe size={22} />,
            title: "Request → response",
            subtitle: "Client always asks first",
            body: "The browser is the client and the board is the server. The board can never push a message on its own — which is exactly the limit Task 2 removes.",
          },
          {
            icon: <FileCode2 size={22} />,
            title: "Route + handler",
            subtitle: "/ · /ledon · /ledoff",
            body: "Each URL path maps to one function. The root route returns the control page; the other two switch GPIO 2 and return a short confirmation.",
          },
          {
            icon: <Wifi size={22} />,
            title: "Station vs access point",
            subtitle: "How the board gets an address",
            body: "In station mode the board joins your router and is handed an address (shown on the Serial Monitor). In soft-AP mode it hosts its own network and is reachable at 192.168.4.1.",
          },
        ]}
      />

      <Sub>How the ESP32 and the browser communicate over Wi-Fi</Sub>
      <Prose>
        Both devices sit on the same local network, so the conversation never leaves the building. The browser opens
        a TCP connection to the board&rsquo;s address on port 80, sends a plain-text HTTP request, reads the reply
        and closes the connection. Pressing a button is nothing more than the browser requesting a different URL.
      </Prose>
      <Diagram
        {...DIAGRAMS.t1Flow}
        alt="Sequence diagram: the browser sends GET slash, the ESP32 returns the control page, then GET slash ledon switches GPIO 2 high and the ESP32 replies LED is ON"
        caption="One page load and two button presses, as HTTP requests between the browser and the ESP32."
      />
      <Pipeline
        steps={[
          { title: "Join the network", meta: "WiFi.begin()", body: "The ESP32 connects to a 2.4 GHz access point and receives an IP address." },
          { title: "Listen on port 80", meta: "server.begin()", body: "The routes are registered first, then the server starts accepting connections." },
          { title: "Browser asks for /", meta: "GET /", body: "handleRoot() returns the HTML control page with its ON and OFF buttons." },
          { title: "Button press = new request", meta: "GET /ledon · GET /ledoff", body: "The matching handler writes HIGH or LOW to GPIO 2 and returns a one-line confirmation." },
        ]}
      />

      <Sub>Hardware components & software used</Sub>
      <SpecList
        items={[
          { name: "ESP32 DevKit", qty: "1", role: "Main microcontroller — Wi-Fi and GPIO" },
          { name: "Micro-USB cable", qty: "1", role: "Power and serial upload (must be a data cable)" },
          { name: "On-board LED", qty: "GPIO 2", role: "The load — already wired on the board" },
          { name: "2.4 GHz Wi-Fi", qty: "—", role: "ESP32 radios do not join 5 GHz networks" },
          { name: "Laptop or phone", qty: "1", role: "Runs the browser used as the controller" },
        ]}
      />
      <ChipRow
        items={[
          { label: "Arduino IDE", description: "Editor, compiler, uploader" },
          { label: "ESP32 board package", description: "Boards Manager · ESP32 Dev Module" },
          { label: "WiFi.h + WebServer.h", description: "Bundled with the core — no extra install" },
          { label: "Serial Monitor", description: "115200 baud" },
        ]}
      />

      <Sub>Circuit / wiring diagram & ESP32 pin connections</Sub>
      <Diagram
        {...DIAGRAMS.t1Wiring}
        alt="Wiring diagram: USB powers the ESP32; GPIO 2 drives the on-board blue LED through a resistor to ground"
        caption="There is nothing to wire: the load is the blue LED already on the board, driven from GPIO 2."
      />
      <PinTable
        rows={[
          ["GPIO 2", "On-board blue LED", "Output — HIGH lights the LED, LOW turns it off"],
          ["USB 5 V", "Board regulator → 3V3", "Powers the ESP32 and the Wi-Fi radio"],
          ["USB D+/D−", "USB–UART bridge → UART0", "Firmware upload and Serial Monitor"],
          ["GND", "Common ground", "Return path for the LED current"],
        ]}
        head={["Pin / line", "Connected to", "Purpose"]}
      />
      <Prose className="mt-4" >
        To drive an <em>external</em> LED instead, the wiring is GPIO → 220 Ω resistor → LED anode, LED cathode →
        GND; the sketch only changes its pin number.
      </Prose>

      <Sub>HTML interface developed for controlling the LED</Sub>
      <Prose>
        The interface is a single card with a title, a one-line description and two buttons — green for ON, red for
        OFF. It is plain HTML and CSS with no JavaScript and no external files, which is what lets it live in the
        firmware as a string.
      </Prose>
      <CodeBlock filename="control page (embedded in the sketch)">{T1_HTML}</CodeBlock>

      <Sub>How the webpage sends a command to the ESP32</Sub>
      <ArrowList
        label="BUTTON → LED, STEP BY STEP"
        items={[
          <>Each button sits inside an <code>&lt;a href=&quot;/ledon&quot;&gt;</code> (or <code>/ledoff</code>) link, so pressing it makes the browser navigate to that path</>,
          <>Navigating is an HTTP <Term>GET</Term> request to the board&rsquo;s address — the path <em>is</em> the command</>,
          <>The matching handler runs <code>digitalWrite(ledPin, HIGH)</code> or <code>LOW</code>, then replies with a short confirmation page</>,
          <>No JavaScript is needed. The cost is a full page load per press; an <code>fetch(&quot;/ledon&quot;)</code> call would update the page in place and is the obvious next improvement</>,
        ]}
      />

      <Sub>Complete Arduino / ESP32 source code</Sub>
      <CollapsibleCode summary={`Complete sketch · ${T1_SKETCH.split("\n").length} lines (click to expand)`} filename="Task_01_ESP32_WebServer_LED.ino">
        {T1_SKETCH}
      </CollapsibleCode>
      <ArrowList
        label="WHAT EACH PART DOES"
        items={[
          <><Term>ssid / password</Term> — the 2.4 GHz network the board joins; replace the placeholders before flashing</>,
          <><Term>WebServer server(80)</Term> — the HTTP server object, created once at global scope</>,
          <><Term>INDEX_HTML</Term> — the control page, stored in flash with <code>PROGMEM</code> so it does not use RAM</>,
          <><Term>handleRoot / handleLEDOn / handleLEDOff</Term> — one function per route; the last two write the LED pin and log to Serial</>,
          <><Term>setup()</Term> — starts Serial at 115200, sets the pin as an output, connects to Wi-Fi, prints the address, registers the routes, starts the server</>,
          <><Term>loop()</Term> — only <code>server.handleClient()</code>; everything else is event-driven</>,
        ]}
      />
      <Pipeline
        steps={[
          { title: "Add ESP32 board support", meta: "Arduino IDE", body: "Install the ESP32 core through the Boards Manager, then select ESP32 Dev Module and the right COM port." },
          { title: "Flash the firmware", meta: "Upload", body: "Paste the sketch, set the Wi-Fi credentials, and upload. The board hard-resets over the RTS pin once the write is verified." },
          { title: "Find the address", meta: "Serial Monitor · 115200", body: "Open the Serial Monitor and note the address the board reports once it is on the network." },
          { title: "Drive it from a browser", meta: "Any device on the same network", body: "Open that address and use the control page — or hit the endpoints directly to confirm the routes independently of the UI." },
        ]}
      />
      <Callout label="ABOUT THE ADDRESS IN THE SCREENSHOT">
        The browser screenshot below shows the control page at <code>192.168.4.1</code> — the default address of the
        ESP32&rsquo;s own soft access point. The sketch&rsquo;s main path is station mode (join the router, read the
        address from Serial); the soft-AP lines are included as a commented alternative. The request flow is
        identical either way.
      </Callout>

      <Sub>Photographs of the physical setup</Sub>
      <MediaWall
        columns={3}
        aspect="1/1"
        tiles={[
          { kind: "image", src: PHOTOS.esp32On, alt: "ESP32 development board connected by USB with its blue on-board LED lit", label: "The board", caption: "GPIO 2 high — the LED on the board, powered over USB.", fit: "cover" },
          { kind: "image", src: PHOTOS.playgroundUi, alt: "A hand holding the ESP32 board with its LED lit in front of a laptop showing the ESP32 LED page, state ON", label: "Board + page", caption: "Board in hand, page on the laptop — the page reports state ON while the board’s LED is lit." },
          { kind: "image", src: PHOTOS.breadboardRelay, alt: "ESP32 connected by jumper wires to a breadboard with a relay module, a green LED and a push button", label: "Breadboard", caption: "The breadboard side of the build: ESP32 wired to a relay module, an LED and a push button." },
        ]}
      />

      <Sub>Screenshots of the web interface</Sub>
      <MediaWall
        columns={3}
        aspect="3/4"
        tiles={[
          { kind: "image", src: PHOTOS.webUi, alt: "Browser showing the ESP32 LED Control page with ON and OFF buttons, address bar at 192.168.4.1", label: "192.168.4.1", caption: "The control page: title, description and the green ON / red OFF buttons." },
          { kind: "image", src: PHOTOS.arduinoUpload, alt: "Arduino IDE output pane after a successful upload", label: "Arduino IDE", caption: "IDE output confirming the upload before the page was opened." },
          { kind: "note", eyebrow: "Reading the screenshots", title: "Same server, two addresses", body: (
            <>
              <p><code>192.168.4.1</code> is the board&rsquo;s own access point; <code>192.168.137.186</code> (the styled page in the photo above) is an address handed out by a hotspot when the board joins as a station.</p>
              <p className="mt-2">Either way the page, the two buttons and the request flow are the same.</p>
            </>
          ) },
        ]}
      />

      <Sub>Video — LED ON / OFF control from the webpage</Sub>
      <MediaWall
        columns={3}
        aspect="9/13"
        tiles={[
          { kind: "video", src: VIDEOS.ledWeb.src, poster: VIDEOS.ledWeb.poster, alt: "Pressing ON and OFF in the browser while the board's LED responds", label: "Clip 01 · Browser", caption: "Pressing ON and OFF in the browser, with the board’s LED responding in real time." },
          { kind: "video", src: VIDEOS.ledWebBoard.src, poster: VIDEOS.ledWebBoard.poster, alt: "The page at 192.168.4.1 next to the board", label: "Clip 02 · Board + page", caption: "The page at 192.168.4.1 next to the board, so the on-board LED and the browser can be seen together." },
          { kind: "note", eyebrow: "What to watch", title: "Request in, LED out", body: (
            <ul className="list-disc pl-4 space-y-1.5">
              <li>A button press is one HTTP request to <code>/on</code> or <code>/off</code>.</li>
              <li>The LED changes as soon as the handler runs — no page reload is needed to see it.</li>
              <li>Clips play on their own while on screen; tap one to pause, or use full screen for detail.</li>
            </ul>
          ) },
        ]}
      />

      <Sub>Problems encountered & how they were solved</Sub>
      <ProblemList
        items={[
          { problem: <>The board would not appear as a COM port, so the upload could not start.</>, solution: <>The cable was charge-only. Switching to a USB cable that carries data made the port show up.</> },
          { problem: <>The board never joined the network and the Serial Monitor kept printing dots.</>, solution: <>The ESP32 radio is 2.4 GHz only. Connecting it to a 2.4 GHz SSID (or a phone hotspot) fixed it.</> },
          { problem: <>The control page would not open from the browser.</>, solution: <>The address is assigned by the router (or fixed at 192.168.4.1 in soft-AP mode), so it has to be read from the Serial Monitor each time and the laptop has to be on the same network.</> },
          { problem: <>Changing a button colour meant touching the firmware.</>, solution: <>The HTML is a string inside the sketch, so any UI change needs a re-flash. Accepted for this task; serving files from SPIFFS/LittleFS or moving the UI off-board is the later fix.</> },
        ]}
      />

      <Sub>Brief reflection on what I learned</Sub>
      <Callout label="REFLECTION">
        The board stopped being a thing I flash and became a thing I talk to. The more useful lesson was the
        limit: HTTP is immediate and needs no accounts, but the device has to be <em>reachable</em>, so it only works
        on the same network. That limit is the reason Task 2 exists.
      </Callout>

      <Sub>Repository files</Sub>
      <RepoFiles
        folder="Task-01-ESP32-WebServer-LED"
        files={[
          { name: "Task_01_ESP32_WebServer_LED.ino", note: "complete sketch" },
          { name: "README.md", note: "recreation manual for this task" },
        ]}
      />
    </WeekSection>
  );
}
