"use client";

// src/components/protosem/weeks/week7/Task2.tsx
// Task 02 — Adafruit IO dashboard & MQTT.

import { Wifi, Cloud, Plug, Lightbulb, Radio, Inbox, Send } from "lucide-react";
import { WeekSection, Prose, Term, ArrowList, Callout, CardGrid, ChipRow, VideoFigure, Gallery, SpecList, Pipeline } from "../blocks";
import { Sub, Diagram, ProblemList, CollapsibleCode, RepoFiles, PinTable } from "./blocks";
import { DIAGRAMS, PHOTOS, VIDEOS } from "./media";
import { T2_SKETCH } from "./code";

export default function Task2() {
  return (
    <WeekSection eyebrow="TASK 02 · DAY 2" id="task-2" title="Adafruit IO Dashboard & MQTT">
      <Sub>Objective & the problem it addresses</Sub>
      <Prose>
        Task 1 only works if you are standing on the same Wi-Fi. Task 2 removed that limit by switching from
        request–response to <Term>publish–subscribe</Term>: the board opens a long-lived connection to a cloud
        broker and subscribes to a feed, so anything published to that feed — from a dashboard, a script, a phone
        anywhere in the world — reaches the board almost immediately. The goal: switch a relay (and a mains bulb)
        from a web dashboard on a different network.
      </Prose>
      <Prose className="mt-4">
        The inversion is the whole idea. With HTTP the device waits to be reached, which means it must be reachable
        — a public address, port forwarding, or a tunnel. With MQTT the device reaches <em>out</em> and holds the
        connection open, so it works from behind any home router without exposing anything.
      </Prose>

      <Sub>Purpose of Adafruit IO in an IoT system</Sub>
      <Prose>
        <Term>Adafruit IO</Term> is a hosted IoT platform. In one account it provides the three things a small
        project would otherwise need its own server for: an <strong>MQTT broker</strong> (message routing), a{" "}
        <strong>data store</strong> (every value on a feed is kept with a timestamp) and a{" "}
        <strong>dashboard builder</strong> (toggles, gauges and charts bound to feeds). It also exposes a REST API,
        which is how other services — IFTTT in Task 3 — can write to the same feeds. In system terms it is the
        meeting point between the device and every human or service that wants to talk to it.
      </Prose>

      <Sub>Basic concept of MQTT</Sub>
      <Prose>
        <Term>MQTT</Term> (Message Queuing Telemetry Transport) is a lightweight publish–subscribe protocol built for
        constrained devices and unreliable links. Clients never address each other; they connect to a{" "}
        <em>broker</em>, publish messages to named <em>topics</em>, and subscribe to the topics they care about. It
        runs over TCP (port 1883, or 8883 with TLS), has a tiny header, keeps one connection open with periodic
        keep-alive pings, and offers three delivery guarantees (QoS 0, 1, 2).
      </Prose>
      <CardGrid
        columns={3}
        items={[
          { icon: <Send size={22} />, title: "Publisher", subtitle: "Sends messages", body: "Here: the Adafruit IO dashboard’s toggle button (and, in Task 3, an IFTTT applet or any script using the REST API). It publishes ON or OFF." },
          { icon: <Radio size={22} />, title: "Broker", subtitle: "Routes messages", body: "Here: Adafruit IO at io.adafruit.com. It receives every publish and forwards it to all clients subscribed to that topic. It stores nothing about who is listening on the other end." },
          { icon: <Inbox size={22} />, title: "Subscriber", subtitle: "Receives messages", body: "Here: the ESP32. It subscribes to the feed once at start-up and its onMessage handler fires for every new value." },
        ]}
      />
      <Diagram
        {...DIAGRAMS.t2Mqtt}
        alt="Diagram: two publishers send ON and OFF to the Adafruit IO broker, which delivers them to the ESP32 subscriber over a topic named username slash feeds slash esp"
        caption="Publisher, broker and subscriber identified for this build."
      />

      <Sub>Role of an MQTT topic / feed</Sub>
      <Prose>
        A topic is the <em>address of a message stream</em>. Publishers and subscribers never need to know about each
        other — only the topic name. In Adafruit IO a topic is called a <Term>feed</Term>, and every feed has a
        topic of the form <code>&lt;username&gt;/feeds/&lt;feed-key&gt;</code>. Messages published to that topic are
        delivered to every subscriber and are also saved, which is why the dashboard can show history. The Arduino
        library hides the topic string: <code>io.feed(&quot;esp&quot;)</code> builds it and subscribes for you.
      </Prose>

      <Sub>MQTT topic / feed structure used</Sub>
      <PinTable
        rows={[
          ["<username>/feeds/esp", "ON | OFF", "Command feed. Dashboard toggle publishes; the ESP32 subscribes and drives GPIO 26."],
          ["feed key: esp", "plain-text payload", "Payload is compared case-insensitively after trim(), so “on”, “On” and “ON” all work."],
          ["QoS / transport", "MQTT over TCP", "Handled by the Adafruit IO library; connection kept alive by io.run()."],
        ]}
        head={["Topic / feed", "Payload", "Role"]}
      />

      <Sub>Hardware & software used</Sub>
      <SpecList
        items={[
          { name: "ESP32 DevKit", qty: "1", role: "MQTT subscriber and relay driver" },
          { name: "1-channel relay module", qty: "1", role: "Opto-isolated switch for the mains load" },
          { name: "Incandescent bulb + holder", qty: "1", role: "230 V load — the visible result" },
          { name: "Breadboard + jumper wires", qty: "set", role: "Low-voltage connections" },
          { name: "Adafruit IO account", qty: "free tier", role: "Broker, feed storage and dashboard" },
          { name: "Adafruit IO Arduino library", qty: "—", role: "Wi-Fi + MQTT + feed handling in one object" },
        ]}
      />
      <ChipRow
        items={[
          { icon: <Wifi size={18} />, label: "MQTT", description: "Lightweight pub/sub for constrained devices" },
          { icon: <Cloud size={18} />, label: "Adafruit IO", description: "Hosted broker + dashboard" },
          { icon: <Plug size={18} />, label: "Relay module", description: "Isolated switching of the mains load" },
          { icon: <Lightbulb size={18} />, label: "230V bulb", description: "The visible result" },
        ]}
      />

      <Sub>Wiring, pin connections & safety</Sub>
      <Diagram
        {...DIAGRAMS.t2Wiring}
        alt="Wiring diagram: ESP32 GPIO 26 to relay IN, VIN to relay VCC, GND to GND; relay COM takes mains live and NO goes to the bulb; neutral goes straight to the bulb"
        caption="Low-voltage control on the left, mains on the right. The relay is the only thing that crosses between them."
      />
      <PinTable
        rows={[
          ["Relay IN", "GPIO 26", "Control signal — HIGH energises the relay in this sketch"],
          ["Relay VCC", "VIN (5 V)", "Coil supply; the module is a 5 V part"],
          ["Relay GND", "GND", "Common ground between logic and relay board"],
          ["Relay COM / NO", "Mains live → bulb", "Switches only the live conductor"],
        ]}
      />
      <Callout label="SAFETY — MAINS WIRING">
        This is the point in the week where a mistake stops being a compile error. Everything was wired and
        re-checked with the circuit unplugged, the relay switched only the live conductor, and the low-voltage and
        mains sides were kept physically apart. The relay is what makes a 3.3V pin capable of controlling a mains
        load safely — the microcontroller never touches it.
      </Callout>

      <Sub>Adafruit IO account created & documented</Sub>
      <Pipeline
        steps={[
          { title: "Create the account", meta: "io.adafruit.com", body: "Sign up for a free account. The username you choose becomes part of every feed topic." },
          { title: "Find the credentials", meta: "Key icon, top right", body: "The account page shows the username and the AIO key. The key is a secret — it goes into the sketch (or an environment variable), never into a public repository." },
          { title: "Install the library", meta: "Arduino Library Manager", body: "Search “Adafruit IO Arduino” and accept the dependencies (Adafruit MQTT, ArduinoHttpClient)." },
          { title: "Put the four values in the sketch", meta: "WIFI_SSID · WIFI_PASS · IO_USERNAME · IO_KEY", body: "These four defines are all the firmware needs to reach the account." },
        ]}
      />

      <Sub>Dashboard & feed configuration documented</Sub>
      <Pipeline
        steps={[
          { title: "Create the feed", meta: "Feeds → New Feed → “esp”", body: "One feed carries the command. Its key (esp) is what the sketch asks for with io.feed(\"esp\")." },
          { title: "Create the dashboard", meta: "Dashboards → New Dashboard", body: "A named page that holds the interface blocks." },
          { title: "Add a toggle button block", meta: "Block settings", body: "Bind it to the esp feed, set the button-on value to ON and the button-off value to OFF — exactly the two strings the firmware tests for." },
          { title: "Optional: add a stream block", meta: "Same feed", body: "Shows every value published to esp with its timestamp, which makes it easy to confirm a command really reached the broker." },
        ]}
      />
      <Diagram
        {...DIAGRAMS.t2DashboardLayout}
        alt="Layout diagram of the Adafruit IO dashboard: a toggle button block and a stream block bound to the esp feed, plus the feed settings and account keys"
        caption="Dashboard configuration as a layout diagram — blocks, feed bindings and the values they send."
      />

      <Sub>Communication flow between ESP32, MQTT and Adafruit IO</Sub>
      <Pipeline
        steps={[
          { title: "Board connects", meta: "io.connect()", body: "Wi-Fi comes up, then the library opens the MQTT connection to the broker and authenticates with username and key." },
          { title: "Board subscribes", meta: "relayFeed->onMessage()", body: "The handler is registered against the esp feed; relayFeed->get() pulls the last value so the relay matches the dashboard after a reboot." },
          { title: "User presses the toggle", meta: "Dashboard → broker", body: "The dashboard publishes ON or OFF to the esp feed." },
          { title: "Broker delivers", meta: "MQTT push", body: "The message is pushed down the board's open connection — no polling, no inbound port." },
          { title: "Relay switches", meta: "handleMessage()", body: "The value is trimmed and upper-cased, then written to GPIO 26. The bulb follows." },
        ]}
      />

      <Sub>Complete ESP32 source code</Sub>
      <CollapsibleCode summary={`Complete sketch · ${T2_SKETCH.split("\n").length} lines (click to expand)`} filename="Task_02_Adafruit_MQTT_Relay.ino">
        {T2_SKETCH}
      </CollapsibleCode>

      <Sub>Explanation of important code sections</Sub>
      <ArrowList
        items={[
          <><Term>AdafruitIO_WiFi io(...)</Term> — one object that owns the Wi-Fi connection <em>and</em> the MQTT session; the four defines above it are its configuration</>,
          <><Term>io.feed(&quot;esp&quot;)</Term> — resolves the feed key into the topic and returns a handle used for subscribe/get</>,
          <><Term>handleMessage()</Term> — the subscriber callback: normalises the text (<code>trim()</code>, <code>toUpperCase()</code>) so formatting differences cannot break the comparison, then writes the relay pin</>,
          <><Term>relayFeed-&gt;onMessage(handleMessage)</Term> — registers the callback before connecting, so no message can arrive without a handler</>,
          <><Term>while (io.status() &lt; AIO_CONNECTED)</Term> — blocks setup until the broker session is up, printing dots to Serial</>,
          <><Term>relayFeed-&gt;get()</Term> — requests the most recent value so a reboot does not leave the relay out of step with the dashboard</>,
          <><Term>io.run()</Term> in <code>loop()</code> — must be called constantly; it services keep-alives and incoming messages. A long <code>delay()</code> here would drop the connection</>,
        ]}
      />

      <Sub>Photographs of the hardware setup</Sub>
      <Gallery
        columns={3}
        items={[
          { src: PHOTOS.labPoster, alt: "Lab bench with laptops, relay boards and mains bulbs wired up for the cloud relay task", caption: "The bench: laptops, relay modules and the mains bulbs.", aspect: "16/9", fit: "cover" },
          { src: PHOTOS.bulbOn, alt: "The bulb lit after the ON command from the cloud dashboard", caption: "ON published — the relay closes and the bulb lights.", aspect: "16/9", fit: "cover" },
          { src: PHOTOS.bulbOff, alt: "The bulb dark after the OFF command", caption: "OFF published — relay open, bulb dark.", aspect: "16/9", fit: "cover" },
        ]}
      />

      <Sub>Screenshots of the Adafruit IO dashboard</Sub>
      <Diagram
        {...DIAGRAMS.t2DashboardLayout}
        alt="Adafruit IO dashboard layout: toggle block with ON and OFF values, stream block and feed settings for the esp feed"
        caption="Dashboard layout for the esp feed (diagram of the configuration shown above)."
      />

      <Sub>LED / relay control through the cloud dashboard — demonstration</Sub>
      <Prose>
        Pressing the toggle in the dashboard publishes to the feed; the ESP32 receives it and the relay closes. The
        control path no longer depends on the laptop and the board sharing a network, only on both reaching the
        internet.
      </Prose>
      <VideoFigure
        src={VIDEOS.relayBulb.src}
        poster={VIDEOS.relayBulb.poster}
        caption="Working demonstration — relay, breadboard and the mains bulb being switched from the cloud dashboard."
        maxWidth="720px"
      />

      <Sub>Problems encountered during MQTT / cloud setup & solutions implemented</Sub>
      <ProblemList
        items={[
          { problem: <>The board connected to Wi-Fi but never reached the broker.</>, solution: <>The username or AIO key in the sketch was wrong or had stray whitespace. Re-copying both from the account key panel fixed it; <code>io.statusText()</code> on Serial reports which stage failed.</> },
          { problem: <>The relay ignored commands typed in different cases (“on”, “On”).</>, solution: <>Normalising the payload with <code>trim()</code> and <code>toUpperCase()</code> before comparing made the handler tolerant.</> },
          { problem: <>After a reboot the bulb and the dashboard toggle disagreed.</>, solution: <>Calling <code>relayFeed-&gt;get()</code> after connecting pulls the last stored value so the hardware re-syncs.</> },
          { problem: <>The connection dropped when extra delays were added to <code>loop()</code>.</>, solution: <>MQTT needs <code>io.run()</code> to be called continuously for keep-alives; the loop was kept free of blocking delays.</> },
          { problem: <>The relay clicked but the bulb did not respond.</>, solution: <>The mains live was wired to the wrong relay terminal. Re-checking COM / NO with the circuit unplugged corrected it.</> },
        ]}
      />

      <Sub>Brief learning reflection</Sub>
      <Callout label="REFLECTION">
        Publish–subscribe changed how I think about “connecting” two devices: they never connect to each other, they
        both connect to a broker. That removed the reachability problem from Task 1 and added a new dependency — a
        broker I do not own. The feed became the contract between everything that can write and everything that
        listens, and Task 3 leans on exactly that.
      </Callout>

      <Sub>Repository files</Sub>
      <RepoFiles
        folder="Task-02-AdafruitIO-MQTT-Relay"
        files={[
          { name: "Task_02_Adafruit_MQTT_Relay.ino", note: "complete sketch (credentials are placeholders)" },
          { name: "README.md", note: "account, feed and dashboard setup + wiring" },
        ]}
      />
    </WeekSection>
  );
}
