"use client";

// src/components/protosem/weeks/Week7Content.tsx
// Week 7 — IoT & Embedded Systems.
// A five-task smart-home build on the ESP32, each task adding one layer:
// local HTTP -> cloud MQTT -> voice triggers -> Firebase dashboard -> logging, automation and export.
// The tasks live in ./week7/TaskN.tsx; this file is the shell, overview and wrap-up.
// The floating task bar (./week7/TaskNav.tsx) targets the section ids defined there:
// overview, task-1 … task-5, wrap-up.

import { Cpu, Cloud, Mic, Database, LineChart } from "lucide-react";

import { WeekShell, WeekSection, Prose, Term, Callout, CardGrid, StatRow, ArrowList } from "./blocks";
import TaskNav from "./week7/TaskNav";
import Task1 from "./week7/Task1";
import Task2 from "./week7/Task2";
import Task3 from "./week7/Task3";
import Task4 from "./week7/Task4";
import Task5 from "./week7/Task5";
import { RepoFiles } from "./week7/blocks";
import { REPO } from "./week7/media";

export default function Week7Content() {
  return (
    <>
      <WeekShell
        slug="week-7"
        subtitle="Five tasks, one system — from a light switch on the local network to a sensor-driven, self-logging dashboard in the cloud."
      >
        {/* ── Overview ─────────────────────────────────────────── */}
        <WeekSection eyebrow="OVERVIEW" id="overview" title="The Week in One Line">
          <Prose>
            Week 7 was the hardware week. The brief was to build a working smart-home system on an{" "}
            <Term>ESP32</Term>, but the point was not the finished gadget — it was the <strong>progression</strong>.
            Each task kept the same physical outcome (a light turning on) and changed only the path the command
            travelled. By the end, the same relay could be driven from a browser on the same Wi-Fi, from a dashboard
            on the other side of the internet, from a spoken sentence, from a login-protected web app — or by the
            room deciding for itself that it had got dark, with every decision logged.
          </Prose>
          <Prose className="mt-4">
            Holding the outcome constant while varying the architecture is what made the trade-offs legible.{" "}
            <strong>HTTP is immediate but trapped on the local network</strong>.{" "}
            <strong>MQTT escapes the network but introduces a broker you do not own</strong>. Voice adds delightful
            ergonomics and two seconds of latency. A full-stack backend gives you history and autonomy, and a great
            deal more to maintain.
          </Prose>

          <StatRow
            items={[
              { value: "3", label: "Days" },
              { value: "5", label: "Tasks" },
              { value: "3", label: "Cloud services" },
              { value: "230V", label: "Live load switched" },
            ]}
          />

          <CardGrid
            columns={3}
            items={[
              { icon: <span className="f-mono">01</span>, title: "ESP32 Web Server", subtitle: "HTTP · local network", body: "A web server on the board and an HTML page that turns an LED on and off." },
              { icon: <Cloud size={22} />, title: "Adafruit IO & MQTT", subtitle: "Publish–subscribe · cloud", body: "A hosted broker and dashboard switch a relay and a mains bulb from anywhere." },
              { icon: <Mic size={22} />, title: "IFTTT automation", subtitle: "Trigger → action", body: "A spoken phrase reaches the same feed — with no change to the firmware." },
              { icon: <Database size={22} />, title: "Firebase dashboard", subtitle: "Realtime DB + Auth", body: "Live sensor telemetry on a login-protected dashboard; cloud concepts and security." },
              { icon: <Cpu size={22} />, title: "Automation & logging", subtitle: "LDR · DHT11 · modes", body: "Manual / automatic bulb control, timestamped history in Firebase." },
              { icon: <LineChart size={22} />, title: "Charts & CSV export", subtitle: "Data you can question", body: "History on the dashboard as a chart and table, exported as a CSV file." },
            ]}
          />
          <ArrowList
            label="USE THE BAR AT THE BOTTOM OF THE SCREEN"
            items={[
              <>Once you scroll past this header, a floating task bar appears — jump straight to Task 01–05 or the wrap-up, and it highlights the task you are reading.</>,
            ]}
          />
        </WeekSection>

        <Task1 />
        <Task2 />
        <Task3 />
        <Task4 />
        <Task5 />

        {/* ── Wrap-up ──────────────────────────────────────────── */}
        <WeekSection eyebrow="SYNTHESIS" id="wrap-up" title="Five Paths to the Same Light">
          <Prose>
            Laid side by side, the five tasks are a decision table. None is strictly better — each buys something and
            gives something up.
          </Prose>

          <CardGrid
            columns={2}
            items={[
              { icon: <span className="font-bold text-lg leading-none" style={{ color: "var(--accent-main)" }}>1</span>, title: "Local HTTP", subtitle: "Same network · well under a second", body: "Fastest and fully self-contained — no accounts, no broker, no dependency. Useless the moment you leave the building." },
              { icon: <span className="font-bold text-lg leading-none" style={{ color: "var(--accent-main)" }}>2</span>, title: "Cloud MQTT", subtitle: "Anywhere · around a second", body: "Works from any network without exposing the device. Costs you a dependency on a broker you do not control." },
              { icon: <span className="font-bold text-lg leading-none" style={{ color: "var(--accent-main)" }}>3</span>, title: "Voice", subtitle: "Anywhere · two to three seconds", body: "The best ergonomics of the five and zero new firmware. The slowest path, and it fails if any link in the chain is down." },
              { icon: <span className="font-bold text-lg leading-none" style={{ color: "var(--accent-main)" }}>4</span>, title: "Firebase dashboard", subtitle: "Anywhere · bidirectional", body: "Live telemetry, authentication and authorization. Also the most moving parts and the most to keep running." },
              { icon: <span className="font-bold text-lg leading-none" style={{ color: "var(--accent-main)" }}>5</span>, title: "Automation + logging", subtitle: "Autonomous · recorded", body: "The room decides, and every decision is recorded and exportable. Needs thresholds, pruning and care about who may write." },
            ]}
          />

          <Callout label="WHAT STUCK">
            The week reframed what I think &ldquo;IoT&rdquo; actually means. Very little of the difficulty was in the
            embedded code — the sketches are short, and the hardware is forgiving. The difficulty is in the seams:
            what happens when Wi-Fi drops mid-command, what the dashboard shows when the device has decided something
            on its own, who is allowed to write to the feed. The moment it clicked was Task 3: adding voice control
            required no firmware change at all, because Task 2 had already drawn the boundary in the right place.
          </Callout>

          <Callout label="TAKEAWAY">
            Holding the outcome fixed and varying the architecture is a genuinely good way to learn a domain. Five
            times over, the bulb lit — and each time it taught something different about latency, reach, dependency,
            trust and memory.
            <span className="f-mono block mt-4" style={{ fontSize: "var(--text-2xs)", color: "var(--text-muted)" }}>
              — Sudharshan R · Week 7, ProtoSem
            </span>
          </Callout>

          <Prose className="mt-8">
            All firmware, the dashboard source, the database rules and per-task recreation manuals are in one
            repository, organised task by task:{" "}
            <a href={REPO} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-main)" }}>
              rsd-06/Forge_IOT ↗
            </a>
          </Prose>
          <RepoFiles
            folder="Forge_IOT"
            files={[
              { name: "Task-01-ESP32-WebServer-LED/", note: "web server + HTML LED control", path: "tree/main/Task-01-ESP32-WebServer-LED" },
              { name: "Task-02-AdafruitIO-MQTT-Relay/", note: "MQTT relay via Adafruit IO", path: "tree/main/Task-02-AdafruitIO-MQTT-Relay" },
              { name: "Task-03-IFTTT-Voice-Automation/", note: "IFTTT applets + data flow", path: "tree/main/Task-03-IFTTT-Voice-Automation" },
              { name: "Task-04-Firebase-Dashboard/", note: "Firebase project, auth, dashboard", path: "tree/main/Task-04-Firebase-Dashboard" },
              { name: "Task-05-Firebase-Logging-Automation-CSV/", note: "automation, logging, CSV export", path: "tree/main/Task-05-Firebase-Logging-Automation-CSV" },
            ]}
          />
        </WeekSection>
      </WeekShell>
      <TaskNav />
    </>
  );
}
