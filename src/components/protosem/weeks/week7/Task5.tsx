"use client";

// src/components/protosem/weeks/week7/Task5.tsx
// Task 05 — Firebase logging, automation & data export.

import { Thermometer, Sun, ToggleRight, Cpu } from "lucide-react";
import { WeekSection, Prose, Term, ArrowList, Callout, CardGrid, CodeBlock, Gallery, VideoFigure, SpecList, Pipeline, StatRow } from "../blocks";
import { Sub, Diagram, ProblemList, CollapsibleCode, RepoFiles, PinTable } from "./blocks";
import { DIAGRAMS, PHOTOS, VIDEOS } from "./media";
import { T5_FIRMWARE, T5_CSV_UTIL } from "./code";

const SAMPLE_CSV = `timestamp,datetime,temperature_c,humidity_pct,ldr_adc,bulb_state,mode
1794638402000,2026-11-14T06:40:02.000Z,27.4,61,1850,OFF,automatic
1794638404000,2026-11-14T06:40:04.000Z,27.4,61,2110,OFF,automatic
1794638406000,2026-11-14T06:40:06.000Z,27.5,61,2740,ON,automatic
1794638408000,2026-11-14T06:40:08.000Z,27.5,60,2810,ON,automatic
1794638410000,2026-11-14T06:40:10.000Z,27.5,60,2790,ON,manual`;

export default function Task5() {
  return (
    <WeekSection eyebrow="TASK 05" id="task-5" title="Firebase Logging, Automation & Data Export">
      <Sub>Objective of the complete IoT system</Sub>
      <Prose>
        Task 4 showed the <em>present</em>: live values and a switch. Task 5 turned the system into something that
        can answer questions about the <em>past</em> and act on its own. The finished system measures temperature,
        humidity and light, switches a mains bulb either manually or automatically from the light level, records
        every reading with a timestamp, shows the history as a chart and table on the dashboard, and exports it all
        as a CSV file.
      </Prose>
      <StatRow
        items={[
          { value: "2 s", label: "Sample interval" },
          { value: "3", label: "Sensors / channels" },
          { value: "2", label: "Control modes" },
          { value: "CSV", label: "Export format" },
        ]}
      />

      <Sub>Final system architecture</Sub>
      <Diagram
        {...DIAGRAMS.t4Architecture}
        alt="Final system architecture: ESP32 with DHT11, LDR and relay; Firebase Realtime Database and Authentication; React dashboard; Adafruit IO bulb path"
        caption="Final architecture — device, cloud and dashboard, with Firebase as the shared source of truth."
      />
      <Diagram
        {...DIAGRAMS.t5Wiring}
        alt="Wiring diagram: DHT11 data on GPIO 4, LDR divider junction on GPIO 34, relay input on GPIO 26 and relay supply from VIN"
        caption="Hardware wiring for the complete prototype."
      />
      <PinTable
        rows={[
          ["DHT11 VCC", "3V3", "Sensor power"],
          ["DHT11 DATA", "GPIO 4", "Single-wire digital protocol"],
          ["DHT11 GND", "GND", "Ground"],
          ["LDR divider junction", "GPIO 34 (ADC1)", "Analog light level, 12-bit (0–4095)"],
          ["Divider ends", "3V3 and GND", "Fixed resistor to 3V3, LDR to GND"],
          ["Relay IN", "GPIO 26", "Bulb switching — active-LOW module"],
          ["Relay VCC / GND", "VIN (5 V) / GND", "Relay coil supply"],
        ]}
      />
      <SpecList
        items={[
          { name: "ESP32 DevKit", qty: "1", role: "Samples, decides, logs" },
          { name: "DHT11", qty: "1", role: "Temperature and humidity" },
          { name: "LDR + fixed resistor", qty: "1", role: "Ambient light divider" },
          { name: "1-channel relay + 230 V bulb", qty: "1", role: "The controlled load" },
          { name: "Firebase project", qty: "—", role: "Realtime Database + Authentication" },
          { name: "React dashboard", qty: "—", role: "Live view, control, history, CSV" },
        ]}
      />

      <Sub>DHT11 temperature & humidity monitoring</Sub>
      <Prose>
        The <Term>DHT11</Term> is a digital sensor that returns temperature (about 0–50 °C, ±2 °C) and relative
        humidity (about 20–90 %) over a single data wire. The firmware calls <code>dht.readTemperature()</code> and{" "}
        <code>dht.readHumidity()</code> every two seconds — the sensor cannot be read faster than about once a second
        — and skips the sample if either value comes back as <code>NaN</code>, which is how a failed read shows up.
        On the dashboard the two values appear as live tiles and as series on the history chart.
      </Prose>

      <Sub>LDR-based light-level monitoring</Sub>
      <Prose>
        The <Term>LDR</Term> (light-dependent resistor) changes resistance with light. An ESP32 pin can only measure
        voltage, so the LDR is wired as one half of a <strong>voltage divider</strong> and the junction goes to GPIO
        34, which reads it as a number from 0 to 4095. The pin is on ADC1 on purpose — ADC2 cannot be used while
        Wi-Fi is on. A single reading is noisy, so <code>readLDR()</code> averages a burst of 15 samples before the
        value is used or logged.
      </Prose>
      <CardGrid
        columns={3}
        items={[
          { icon: <Thermometer size={22} />, title: "Temperature", subtitle: "DHT11 · GPIO 4", body: "°C, read every 2 s, logged and charted." },
          { icon: <Thermometer size={22} />, title: "Humidity", subtitle: "DHT11 · GPIO 4", body: "% relative humidity, same read as temperature." },
          { icon: <Sun size={22} />, title: "Light", subtitle: "LDR divider · GPIO 34", body: "12-bit ADC value, averaged over 15 samples." },
        ]}
      />

      <Sub>Manual bulb control</Sub>
      <Prose>
        In manual mode the relay simply follows <code>/appliances/bulbState</code> in the database. The dashboard
        toggle writes that path; the ESP32 has an open stream on it and calls <code>applyRelay()</code> as soon as
        the value changes, so the bulb responds in about a second with no polling. Because the stored value is the
        single source of truth, every signed-in dashboard sees the same state.
      </Prose>

      <Sub>Manual / Automatic mode — implemented & documented</Sub>
      <CardGrid
        columns={2}
        items={[
          { icon: <ToggleRight size={22} />, title: "Manual", subtitle: "/settings/mode = \"manual\"", body: "The user decides. The dashboard toggle is active, and writes to /appliances/bulbState are applied to the relay. The light sensor is still logged but has no say." },
          { icon: <Cpu size={22} />, title: "Automatic", subtitle: "/settings/mode = \"automatic\"", body: "The room decides. Every sample, the board compares light to the threshold and switches the relay itself. The dashboard toggle is disabled so two controllers never fight over one relay." },
        ]}
      />
      <Prose className="mt-4">
        The mode itself is just another value in the database, so it is changed from the dashboard and reaches the
        board over the same stream as everything else — no reflash needed to change behaviour.
      </Prose>

      <Sub>Automatic bulb control using the LDR & the logic behind it</Sub>
      <Diagram
        {...DIAGRAMS.t5Automation}
        alt="Flowchart: read sensors; if mode is manual the relay follows the dashboard; if automatic compare the LDR reading with the threshold, set the relay, write the state back and push a log record"
        caption="One pass of the control loop, every 2 seconds."
      />
      <ArrowList
        label="THE LOGIC, IN PLAIN WORDS"
        items={[
          <>Wiring makes a <strong>higher ADC reading mean a darker room</strong> (the LDR is on the ground side of the divider).</>,
          <>In automatic mode: <code>shouldBeOn = (light &gt; ldrThreshold)</code> — dark enough means the bulb should be ON.</>,
          <>The relay is only touched when <code>shouldBeOn</code> differs from the current state, so it is not re-written every cycle.</>,
          <>When it does change, the board <strong>writes the new state back</strong> to <code>/appliances/bulbState</code>, so the dashboard always shows what the hardware is actually doing.</>,
          <>The relay module is <strong>active-LOW</strong>, so <code>applyRelay(true)</code> drives the pin LOW. That inversion lives in one function and nowhere else.</>,
        ]}
      />

      <Sub>LDR threshold / calibration method</Sub>
      <Diagram
        {...DIAGRAMS.t5LdrThreshold}
        alt="Scale of the 12-bit ADC from 0 to 4095 with the threshold marked at 2500; brighter readings on the left keep the relay off, darker readings on the right switch it on"
        caption="The threshold is just a number on the ADC scale; the default in the sketch is 2500."
      />
      <Pipeline
        steps={[
          { title: "Measure both extremes", meta: "Serial Monitor", body: "Print the averaged reading in normal room light, then again with the sensor covered. Those two numbers are the bright and dark ends of the usable range." },
          { title: "Choose a starting point", meta: "Between the extremes", body: "Pick a value between them — the sketch starts at 2500 — so “dark enough” sits clearly away from ordinary flicker." },
          { title: "Store it in the database", meta: "/settings/ldrThreshold", body: "The value is not compiled in. The dashboard writes it and the board picks it up over the stream, so tuning never needs a re-flash." },
          { title: "Test and adjust", meta: "Torch / hand over the sensor", body: "Cover and uncover the LDR and watch the bulb. If it flickers around the switching point, move the threshold further from the room's resting value." },
        ]}
      />
      <Callout label="KNOWN LIMITATION OF A SINGLE THRESHOLD">
        With one cut-over value, a reading that hovers right at the threshold can toggle the relay repeatedly.
        Adding <strong>hysteresis</strong> (switch on above one value, off below a slightly lower one) is the standard
        fix and is listed under future improvements.
      </Callout>

      <Sub>Historical data logging in Firebase</Sub>
      <Prose>
        Every sample is also <strong>appended</strong> to <code>/sensorData</code> with <code>pushJSON</code>.
        Because <code>push</code> creates a new time-ordered child each time, nothing is ever overwritten — the node
        grows into a history. The dashboard&rsquo;s live tiles read the newest child; the chart, table and CSV export
        read the same node.
      </Prose>
      <Diagram
        {...DIAGRAMS.t5Logging}
        alt="Logging pipeline from sample to push to storage to dashboard to chart and table to CSV export, with an example record and the CSV header"
        caption="A reading's journey from sensor to file."
      />

      <Sub>Database structure used for the logs</Sub>
      <PinTable
        rows={[
          ["/sensorData/<pushId>", "object", "One record per sample. The push id is time-ordered, so the list is already chronological."],
          ["temperature", "number", "°C from the DHT11"],
          ["humidity", "number", "% RH from the DHT11"],
          ["ldr", "number 0–4095", "Averaged ADC value"],
          ["bulbState", "boolean", "Relay state at that moment"],
          ["mode", "\"manual\" | \"automatic\"", "Operating mode at that moment"],
          ["timestamp", "number (ms)", "Filled in by the database server"],
        ]}
        head={["Field", "Type", "Meaning"]}
      />
      <Diagram
        {...DIAGRAMS.t4Dbtree}
        alt="Realtime Database tree showing the sensorData node with its push-id records and fields"
        caption="The log node sits alongside the control paths in the same tree."
      />

      <Sub>Timestamped readings, and what is recorded</Sub>
      <ArrowList
        items={[
          <><Term>Timestamp</Term> — <code>json.set(&quot;timestamp/.sv&quot;, &quot;timestamp&quot;)</code> asks Firebase to fill in the server time when the record arrives. The ESP32 has no battery-backed clock and needs no NTP code; the trade-off is that the stamp is arrival time, not sample time.</>,
          <><Term>Temperature and humidity</Term> — recorded as <code>temperature</code> and <code>humidity</code> on every record.</>,
          <><Term>LDR / light level</Term> — recorded as <code>ldr</code>, the averaged ADC value (so a threshold can be judged against real history).</>,
          <><Term>Bulb status and operating mode</Term> — recorded as <code>bulbState</code> and <code>mode</code>, which makes it possible to tell later whether the bulb was on because a person asked or because the room got dark.</>,
        ]}
      />

      <Sub>Complete ESP32 source — sensing, automation and logging</Sub>
      <CollapsibleCode summary={`Complete sketch · ${T5_FIRMWARE.split("\n").length} lines (click to expand)`} filename="Task_05_Firebase_Logging_Automation.ino">
        {T5_FIRMWARE}
      </CollapsibleCode>

      <Sub>Historical data displayed on the dashboard, with a graph</Sub>
      <Prose>
        The dashboard keeps a window of the latest readings with a Realtime Database query
        (<code>limitToLast(60)</code>) and renders them two ways: a <strong>chart</strong> that plots temperature,
        humidity and light on one time axis (each series scaled to its own range, since 27 °C and a 4095-step ADC
        cannot share an axis), and a <strong>table</strong> of the most recent rows with time, values, bulb state
        and mode.
      </Prose>
      <Diagram
        {...DIAGRAMS.t5DashboardLayout}
        alt="Dashboard with live tiles, controls, a Download CSV button, a history chart and a history table"
        caption="History section of the dashboard: chart above, recent rows below, export on the right."
      />

      <Sub>CSV data download</Sub>
      <Prose>
        The <strong>Download CSV</strong> button reads the <em>whole</em> <code>/sensorData</code> node (not just the
        visible window), sorts it by timestamp, turns each record into a row, wraps the text in a{" "}
        <code>Blob</code> and triggers a browser download — entirely in the front end, no server involved.
      </Prose>
      <CollapsibleCode summary="src/utils/csv.js — turning records into a file" filename="src/utils/csv.js">{T5_CSV_UTIL}</CollapsibleCode>

      <Sub>Downloaded file contains the recorded data</Sub>
      <Prose>
        The file has one header row and one row per logged reading, with the same fields that are stored in the
        database plus a human-readable ISO date-time derived from the timestamp. It opens directly in Excel, Google
        Sheets or a Python notebook. Example of the layout (values here are illustrative — open your own export to
        compare):
      </Prose>
      <CodeBlock filename="sensor_log_YYYY-MM-DD.csv">{SAMPLE_CSV}</CodeBlock>
      <ArrowList
        label="WHAT A READER CAN CHECK IN THE FILE"
        items={[
          <>Temperature, humidity and light are all present and numeric, one row per sample about two seconds apart.</>,
          <>The <code>mode</code> and <code>bulb_state</code> columns show <em>why</em> the bulb is on: in the example, the light value crosses the threshold and the bulb switches ON while the mode is <code>automatic</code>.</>,
        ]}
      />

      <Sub>Screenshots — Firebase log data, dashboard and data visualisation</Sub>
      <Diagram
        {...DIAGRAMS.t4Dbtree}
        alt="Firebase log data: the sensorData node with push-id children and their fields"
        caption="Firebase log data — the sensorData node and one expanded record."
      />
      <Diagram
        {...DIAGRAMS.t5DashboardLayout}
        alt="Dashboard and data visualisation: live tiles, history chart and table, Download CSV button"
        caption="Dashboard and data visualisation."
      />

      <Sub>Photographs of the complete prototype</Sub>
      <Gallery
        columns={3}
        items={[
          { src: PHOTOS.labPoster, alt: "Lab bench with the ESP32, relay module and mains bulb of the complete prototype", caption: "The prototype on the bench — ESP32, relay and bulb.", aspect: "16/9", fit: "cover" },
          { src: PHOTOS.bulbOn, alt: "Bulb lit by the relay in the complete prototype", caption: "Bulb ON — by dashboard command or by the room getting dark.", aspect: "16/9", fit: "cover" },
          { src: PHOTOS.bulbOff, alt: "Bulb off in the complete prototype", caption: "Bulb OFF.", aspect: "16/9", fit: "cover" },
        ]}
      />

      <Sub>Video — the complete system</Sub>
      <VideoFigure
        src={VIDEOS.relayBulb.src}
        poster={VIDEOS.relayBulb.poster}
        caption="The relay-and-bulb end of the system switching on command. The sensing, logging and dashboard sides are documented above."
        maxWidth="720px"
      />

      <Sub>Problems encountered & solutions implemented</Sub>
      <ProblemList
        items={[
          { problem: <>The light reading was too noisy to base a switching decision on.</>, solution: <>Averaged 15 samples per reading before comparing against the threshold.</> },
          { problem: <>In automatic mode the dashboard toggle and the light sensor could fight over the relay.</>, solution: <>Manual writes are ignored by the firmware when the mode is automatic, and the dashboard disables the toggle in that mode.</> },
          { problem: <>After the board decided on its own, the dashboard showed a stale bulb state.</>, solution: <>The board writes the new state back to <code>/appliances/bulbState</code> whenever it changes the relay itself.</> },
          { problem: <>The ESP32 had no real-time clock to stamp readings.</>, solution: <>Used the database&rsquo;s server timestamp instead of adding NTP code to the board.</> },
          { problem: <>The relay module behaved inverted compared with the Task 2 module.</>, solution: <>Recognised it as active-LOW and put the inversion in the single <code>applyRelay()</code> function.</> },
        ]}
      />

      <Sub>Limitations of the current prototype</Sub>
      <ArrowList
        items={[
          <><strong>Single threshold, no hysteresis</strong> — a reading hovering at the cut-over can flicker the relay.</>,
          <><strong>Unbounded history</strong> — a record every 2 s is about 43,000 a day; nothing prunes or downsamples old data, so storage and the CSV size grow without limit.</>,
          <><strong>Arrival-time timestamps</strong> — the stamp is when the record reaches Firebase, so a Wi-Fi outage delays and mis-times samples, and nothing is buffered on the device.</>,
          <><strong>DHT11 accuracy</strong> — roughly ±2 °C and ±5 % RH, and slow; fine for trends, not for measurement.</>,
          <><strong>Broad control stream</strong> — the board listens to the whole tree, so every logged record also generates a small event on the device.</>,
          <><strong>Adafruit key in the browser</strong> — the documented trade-off from the auth section until the server-side function can ship.</>,
          <><strong>No alerting</strong> — the system records and controls but never tells anyone when something is wrong.</>,
        ]}
      />

      <Sub>Possible future improvements</Sub>
      <ArrowList
        items={[
          <>Add <strong>hysteresis</strong> (separate on/off thresholds) or a minimum time between switches to stop flicker.</>,
          <>Move control values under a dedicated <code>/control</code> node and stream only that, or move history to a <strong>circular buffer / hourly aggregates</strong> via a scheduled function.</>,
          <>Ship the <strong>server-side Cloud Function</strong> so the Adafruit key never reaches the browser.</>,
          <>Buffer readings on the device and sync after an outage, with an NTP-derived sample time.</>,
          <>Add <strong>alerts</strong> (push or email) when temperature or humidity leave a range, and a schedule mode alongside manual/automatic.</>,
          <>Swap the DHT11 for a more accurate sensor (DHT22 / BME280) and add range-selectable charts (last hour / day).</>,
        ]}
      />

      <Sub>Final learning reflection</Sub>
      <Callout label="REFLECTION">
        Logging is what turned the project from a demo into something I can ask questions of — how warm the room
        gets, how often the light triggers the bulb, whether the threshold is set sensibly. Building it showed me that
        the interesting engineering is not in reading a sensor but in everything around it: what to store, who may
        change it, what happens when parts disagree, and what the data will cost to keep. Holding the outcome fixed
        and varying the architecture was a genuinely good way to learn this domain.
      </Callout>

      <Sub>Repository — all source code and project files</Sub>
      <RepoFiles
        folder="Task-05-Firebase-Logging-Automation-CSV"
        files={[
          { name: "Task_05_Firebase_Logging_Automation.ino", note: "complete sketch: sensing, automation, logging" },
          { name: "README.md", note: "automation logic, calibration, log schema, CSV format, limitations" },
          { name: "../Task-04-Firebase-Dashboard/dashboard", note: "dashboard source that reads the log and exports CSV", path: "tree/main/Task-04-Firebase-Dashboard/dashboard" },
        ]}
      />
    </WeekSection>
  );
}
