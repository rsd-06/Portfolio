"use client";

// src/components/protosem/weeks/week7/Task3.tsx
// Task 03 — IFTTT + Adafruit IO IoT automation (no new firmware).

import { Mic, Zap, Cloud, Cpu } from "lucide-react";
import { WeekSection, Prose, Term, ArrowList, Callout, CardGrid, ChipRow, VideoFigure, Gallery, SpecList, Pipeline } from "../blocks";
import { Sub, Diagram, ProblemList, RepoFiles, PinTable } from "./blocks";
import { DIAGRAMS, PHOTOS, VIDEOS } from "./media";

export default function Task3() {
  return (
    <WeekSection eyebrow="TASK 03 · DAY 3" id="task-3" title="IFTTT + Adafruit IO: A Voice Layer on Top">
      <Sub>Objective of the IoT automation</Sub>
      <Prose>
        Task 3 added no firmware at all — and that was the lesson. The objective was to make the Task 2 bulb obey a{" "}
        <em>spoken</em> command by chaining cloud services together, without touching the ESP32. Because Task 2
        already listened to a feed, any new way of writing to that feed becomes a new way of controlling the bulb.
      </Prose>

      <Sub>Basic concept of IoT automation</Sub>
      <Prose>
        IoT automation means a system acts on its own in response to an event instead of waiting for a person to
        operate a control. The event can be a sensor reading, a schedule, a webhook or a spoken phrase; the
        response is an action on a device. It is built from three layers: a <strong>trigger</strong> that detects the
        event, <strong>logic</strong> that decides what to do, and an <strong>actuator</strong> that does it. In this
        task the trigger is a voice phrase, the logic lives in an IFTTT applet, and the actuator is the relay.
      </Prose>

      <Sub>What IFTTT is and why it is used</Sub>
      <Prose>
        <Term>IFTTT</Term> (“If This Then That”) is a no-code automation service that connects other web services
        with rules called <em>applets</em>. Each applet pairs one trigger from one service with one action on another.
        It is used here because it already integrates with voice assistants on one side and can call web endpoints on
        the other — writing that glue myself would mean building and hosting a voice-handling server just to send one
        HTTP request.
      </Prose>

      <Sub>Trigger → Action concept</Sub>
      <CardGrid
        columns={2}
        items={[
          { icon: <Mic size={22} />, title: "Trigger  (IF THIS)", subtitle: "The event that starts the applet", body: "A spoken phrase recognised by the voice assistant. The applet does nothing until the assistant reports that phrase." },
          { icon: <Zap size={22} />, title: "Action  (THEN THAT)", subtitle: "What the applet does in response", body: "An outbound call that writes the value ON (or OFF) to the Adafruit IO feed. One applet per command." },
        ]}
      />
      <Diagram
        {...DIAGRAMS.t3Applet}
        alt="IFTTT applet diagram: IF a voice trigger phrase is heard, THEN send the value ON to the Adafruit IO feed esp"
        caption="The applet as a pair of blocks — IF THIS on the left, THEN THAT on the right."
      />

      <Sub>Role of Adafruit IO in the automation</Sub>
      <Prose>
        Adafruit IO is the <strong>meeting point</strong>. IFTTT cannot talk to an ESP32 — the board has no public
        address — but it can talk to a REST API. Adafruit IO accepts that request, stores the value on the feed and
        republishes it over MQTT to the connection the board already holds open. It converts “an HTTP call from the
        internet” into “a message on a feed the device is subscribed to”.
      </Prose>
      <Prose className="mt-4">
        That is what a good integration seam looks like: the feed is the contract, and everything on either side of
        it can be replaced independently.
      </Prose>

      <Sub>Hardware & software used</Sub>
      <SpecList
        items={[
          { name: "ESP32 DevKit", qty: "1", role: "Same board and firmware as Task 2 — unchanged" },
          { name: "Relay module + 230 V bulb", qty: "1", role: "Same load as Task 2" },
          { name: "Phone / smart speaker", qty: "1", role: "Hears the spoken trigger phrase" },
          { name: "Voice assistant account", qty: "—", role: "Source of the trigger inside IFTTT" },
          { name: "IFTTT account + applets", qty: "2", role: "One applet for ON, one for OFF" },
          { name: "Adafruit IO feed “esp”", qty: "—", role: "Receives the value and republishes it" },
        ]}
      />
      <ChipRow
        items={[
          { icon: <Mic size={18} />, label: "Voice trigger", description: "Spoken phrase" },
          { icon: <Zap size={18} />, label: "IFTTT", description: "Applet: IF → THEN" },
          { icon: <Cloud size={18} />, label: "Adafruit IO", description: "REST in, MQTT out" },
          { icon: <Cpu size={18} />, label: "ESP32 (Task 2 sketch)", description: "No new code" },
        ]}
      />

      <Sub>IFTTT applet / workflow created & documented</Sub>
      <Pipeline
        steps={[
          { title: "Create an applet", meta: "IFTTT → Create", body: "Start a new applet; IFTTT shows the two empty slots, IF THIS and THEN THAT." },
          { title: "Set the trigger", meta: "IF THIS", body: "Choose the voice-assistant service and the “say a specific phrase” trigger, then type the phrase that means ON." },
          { title: "Set the action", meta: "THEN THAT", body: "Choose the webhook / Adafruit IO action, select the feed esp and set the value to send to ON." },
          { title: "Save and connect the services", meta: "Authorise", body: "IFTTT asks for permission to use the voice account and the Adafruit IO account; the AIO key it needs is the same one used by the firmware." },
          { title: "Repeat for OFF", meta: "Second applet", body: "Same shape, different phrase, value OFF. Two applets, two commands." },
        ]}
      />

      <Sub>Trigger used, action performed & how the trigger reaches the IoT system</Sub>
      <PinTable
        rows={[
          ["Trigger", "Spoken phrase", "Recognised by the voice assistant and reported to IFTTT"],
          ["Action", "Send ON / OFF to feed esp", "An authenticated HTTP request to the Adafruit IO REST endpoint"],
          ["Delivery to the device", "MQTT push", "Adafruit IO republishes the new value to its subscribers — the ESP32 among them"],
        ]}
        head={["Stage", "What it is", "How it works"]}
      />
      <ArrowList
        label="HOW THE TRIGGER REACHES THE BOARD"
        items={[
          <>The board never receives a request from IFTTT. It is <em>subscribed</em>, so the value arrives as a normal MQTT message on the connection it opened itself.</>,
          <>No port forwarding, no public address and no change to the Task 2 firmware — the existing <code>handleMessage()</code> parses the text and drives GPIO 26.</>,
        ]}
      />

      <Sub>Communication / data-flow diagram</Sub>
      <Diagram
        {...DIAGRAMS.t3Flow}
        alt="Data-flow diagram: spoken phrase, IFTTT applet, HTTP POST, Adafruit IO feed, MQTT delivery, ESP32 onMessage, relay and bulb"
        caption="Seven hops from a spoken phrase to a lit bulb — about two to three seconds end to end."
      />
      <Pipeline
        steps={[
          { title: "Spoken phrase", meta: "Voice assistant", body: "A trigger phrase is recognised and matched to an intent." },
          { title: "Applet fires", meta: "IFTTT", body: "The matched intent triggers an applet configured against the assistant service." },
          { title: "Webhook posts", meta: "HTTP POST", body: "The applet sends a request carrying the desired value to the feed's REST endpoint." },
          { title: "Broker republishes", meta: "Adafruit IO", body: "The feed updates and pushes the new value to every subscriber." },
          { title: "Board reacts", meta: "ESP32", body: "The same onMessage handler from Task 2 parses the command and drives the relay pin." },
          { title: "Bulb responds", meta: "~2–3 s end to end", body: "The relay closes and the light comes on — noticeably slower than the local path, and worth it for the ergonomics." },
        ]}
      />

      <Sub>ESP32 source code</Sub>
      <Callout label="NO NEW FIRMWARE">
        This task deliberately has no sketch of its own: the board runs the <strong>Task 2 sketch unchanged</strong> —
        its <code>onMessage</code> handler already reacts to anything that writes ON or OFF to the esp feed. See the
        complete listing under Task 2 above (or <code>Task_02_Adafruit_MQTT_Relay.ino</code> in the repository).
      </Callout>

      <Sub>Screenshots of the IFTTT configuration & the Adafruit IO feed</Sub>
      <Diagram
        {...DIAGRAMS.t3Applet}
        alt="IFTTT configuration: voice trigger phrase on the IF THIS side, Adafruit IO feed esp with value ON on the THEN THAT side"
        caption="IFTTT configuration, applet by applet — the trigger and the action it performs."
      />
      <Diagram
        {...DIAGRAMS.t2DashboardLayout}
        alt="Adafruit IO feed and dashboard: the esp feed receiving ON and OFF values written by the applets"
        caption="Adafruit IO side: the same esp feed and toggle block, now also written to by the applets."
      />

      <Sub>Photographs of the working prototype</Sub>
      <Gallery
        columns={3}
        items={[
          { src: PHOTOS.labPoster, alt: "Lab bench with the relay modules and bulbs used for the voice automation", caption: "Same rig as Task 2 — the voice layer adds no hardware.", aspect: "16/9", fit: "cover" },
          { src: PHOTOS.bulbOn, alt: "Bulb lit after a spoken ON command", caption: "Voice command ON — bulb lit.", aspect: "16/9", fit: "cover" },
          { src: PHOTOS.bulbOff, alt: "Bulb off after a spoken OFF command", caption: "Voice command OFF — bulb dark.", aspect: "16/9", fit: "cover" },
        ]}
      />

      <Sub>Video — the complete automation</Sub>
      <VideoFigure
        src={VIDEOS.relayBulb.src}
        poster={VIDEOS.relayBulb.poster}
        caption="The same relay-and-bulb rig. The voice path ends exactly here: only how the ON/OFF value is produced changes, not what the bulb does."
        maxWidth="720px"
      />

      <Sub>Automation tested under different conditions</Sub>
      <Prose>
        The automation was exercised against a small test matrix rather than a single happy-path press. Each row is a
        condition, the behaviour the design predicts, and what it demonstrates about the chain.
      </Prose>
      <PinTable
        rows={[
          ["ON, then OFF, repeated", "Relay follows every command", "Two independent applets share one feed correctly"],
          ["Dashboard and voice mixed", "Last writer wins", "Both write the same feed, so the bulb follows the most recent command"],
          ["Phone on mobile data, board on Wi-Fi", "Command still arrives", "Different networks — the broker is the only meeting point"],
          ["Board offline when the phrase is spoken", "Applies once it reconnects", "relayFeed->get() restores the last value on reconnect"],
          ["Latency", "About 2–3 s end to end", "Every extra service in the chain adds delay"],
        ]}
        head={["Condition", "Expected result", "What it shows"]}
      />

      <Sub>Problems & their solutions</Sub>
      <ProblemList
        items={[
          { problem: <>The applet fired but the bulb did not change.</>, solution: <>The value sent was not exactly what the firmware tests for. Setting the action value to plain <code>ON</code> / <code>OFF</code> (and keeping the firmware&rsquo;s trim-and-uppercase normalisation) fixed it.</> },
          { problem: <>The command took a noticeable time to arrive.</>, solution: <>Latency is the sum of recognition, IFTTT, the broker and MQTT delivery. It cannot be tuned away; the design accepts it for voice and keeps the local path (Task 1) for when speed matters.</> },
          { problem: <>The applet worked once and then stopped authenticating.</>, solution: <>The linked account permission had to be re-authorised in IFTTT after the key changed; reconnecting the service restored the applet.</> },
        ]}
      />

      <Sub>What I learned about cloud-based automation</Sub>
      <ArrowList
        items={[
          <>Each added service buys convenience and costs latency and a point of failure — if any link is down, the whole chain fails.</>,
          <>The feed as an interface means new triggers (voice, schedules, scripts) can be added without touching the device.</>,
          <>An account key authorises <em>everything</em> on the account, so every service that holds it widens the blast radius — the theme of Task 4.</>,
        ]}
      />

      <Sub>Brief reflection on the assignment</Sub>
      <Callout label="REFLECTION">
        The moment it clicked was here. Adding voice control required no firmware change, because Task 2 had already
        drawn the boundary in the right place. Choosing where the contract lives turned out to matter far more than
        any individual implementation on either side of it.
      </Callout>

      <Sub>Repository files</Sub>
      <RepoFiles
        folder="Task-03-IFTTT-Voice-Automation"
        files={[
          { name: "README.md", note: "applet setup, data flow, test matrix (firmware: see Task 02)" },
        ]}
      />
    </WeekSection>
  );
}
