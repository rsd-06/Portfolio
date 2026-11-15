"use client";

// src/components/protosem/weeks/week7/Task4.tsx
// Task 04 — Firebase IoT monitoring dashboard (cloud concepts, auth, database, dashboard).

import { Server, Layers, AppWindow, Boxes, ShieldCheck, KeyRound } from "lucide-react";
import { WeekSection, Prose, Term, ArrowList, Callout, CardGrid, CodeBlock, SpecList, Pipeline } from "../blocks";
import { Sub, Diagram, ProblemList, CollapsibleCode, RepoFiles, PinTable } from "./blocks";
import { DIAGRAMS } from "./media";
import {
  T4_FIRMWARE, T4_RULES, T4_AUTH_CONTEXT, T4_GUARD, T4_LOGIN, T4_DASHBOARD, T4_CHART, T4_ADAFRUIT, SECRET_CODE,
} from "./code";

export default function Task4() {
  return (
    <WeekSection eyebrow="TASK 04" id="task-4" title="Firebase IoT Monitoring Dashboard">
      <Sub>Objective of the Firebase IoT monitoring system</Sub>
      <Prose>
        The final stretch pulled the previous tasks into one system with three layers: a hardware layer that senses
        and actuates, a cloud layer that stores and synchronises state, and a web dashboard for people to actually
        use. Control stopped being one-directional — the device now <em>reports</em> as much as it receives. The
        objective of Task 4 was the monitoring half: stream sensor readings to a cloud database, show them live on a
        login-protected dashboard from anywhere, and let a signed-in user switch the bulb.
      </Prose>

      <Sub>Basic concept of cloud computing</Sub>
      <Prose>
        <Term>Cloud computing</Term> is renting computing — servers, storage, databases, networking, software —
        over the internet from a provider instead of owning and running the machines. Capacity is available on
        demand, scales up or down, is billed by use (or free up to a quota), and the provider is responsible for the
        physical hardware. For IoT it means a device with a few kilobytes of RAM can still keep years of history and
        serve a dashboard to anyone, because the heavy parts live elsewhere.
      </Prose>

      <Sub>IaaS, PaaS, SaaS and BaaS explained</Sub>
      <Prose>
        Cloud services are sold at different levels of abstraction. The higher the level, the less the customer has
        to manage — and the less control they keep.
      </Prose>
      <CardGrid
        columns={2}
        items={[
          { icon: <Server size={22} />, title: "IaaS — Infrastructure as a Service", subtitle: "You get: virtual machines, storage, networks", body: <>The provider runs the data centre and the virtualisation; <strong>you</strong> install the OS, runtime and application and keep them patched. Maximum control, maximum work. Examples: Amazon EC2, Google Compute Engine, Azure VMs. IoT use: renting a VM to run your own MQTT broker.</> },
          { icon: <Layers size={22} />, title: "PaaS — Platform as a Service", subtitle: "You get: a runtime to deploy code onto", body: <>The provider also manages the OS and runtime; you only supply the <strong>application code</strong> and its data. Examples: Google App Engine, Heroku, Vercel. IoT use: deploying your own API or dashboard backend without managing a server.</> },
          { icon: <AppWindow size={22} />, title: "SaaS — Software as a Service", subtitle: "You get: a finished application", body: <>You just <strong>use</strong> the software through a browser or app; the provider runs everything. Examples: Gmail, Google Docs, Adafruit IO&apos;s dashboards, IFTTT. IoT use: Tasks 2 and 3 — configuring a hosted product rather than building one.</> },
          { icon: <Boxes size={22} />, title: "BaaS — Backend as a Service", subtitle: "You get: ready-made backend features", body: <>The provider supplies the <strong>backend building blocks</strong> — database, authentication, file storage, hosting, serverless functions — behind simple SDKs, so the front end can talk to them directly without a custom server. Examples: <strong>Firebase</strong>, Supabase, AWS Amplify. IoT use: this task — Firebase Realtime Database and Authentication replace a server I would otherwise have to write.</> },
        ]}
      />
      <Callout label="WHERE THE LINE FALLS — WHO MANAGES WHAT">
        From most work to least: <strong>IaaS</strong> (you manage OS, runtime, app, data) → <strong>PaaS</strong>{" "}
        (you manage app and data) → <strong>BaaS</strong> (you manage the front end and your data rules; the backend
        is provided) → <strong>SaaS</strong> (you manage only your own content and settings). Firebase sits at BaaS:
        I write the dashboard and the database rules, Google runs everything behind them.
      </Callout>

      <Sub>What a cloud platform is</Sub>
      <Prose>
        A <Term>cloud platform</Term> is a provider&rsquo;s whole bundle of services under one account, one billing
        relationship and one set of tools — compute, storage, databases, identity, monitoring and so on. Firebase is
        the app-development face of Google&rsquo;s cloud platform: the project I create is a container that holds
        the database, the authentication users, the security rules and the hosting configuration together, behind one
        console.
      </Prose>

      <Sub>What a database is</Sub>
      <Prose>
        A <Term>database</Term> is an organised store of data that programs can write to and query reliably — unlike a
        variable, it survives a reboot and can be shared by many clients at once. <em>Relational</em> databases
        (MySQL, PostgreSQL) keep data in tables with fixed columns; <em>NoSQL</em> databases keep it in more flexible
        shapes — documents, key–value pairs or trees. The one used here is a NoSQL tree, which suits sensor
        records whose fields can evolve.
      </Prose>

      <Sub>Firebase Realtime Database explained</Sub>
      <ArrowList
        label="WHAT MAKES IT THE RIGHT TOOL HERE"
        items={[
          <>One big <Term>JSON tree</Term>: every value lives at a path such as <code>/settings/mode</code>, and any path can be read, written or watched on its own</>,
          <><strong>Real-time sync</strong>: clients hold an open connection and are told the moment data under a path changes — the ESP32 uses an open stream, the dashboard uses listeners, so neither polls</>,
          <><code>push()</code> creates a child under a <strong>time-ordered unique key</strong>, which makes it a natural append-only history</>,
          <><strong>Server values</strong> such as <code>{`{".sv": "timestamp"}`}</code> let the database stamp the time, so the ESP32 needs no clock</>,
          <><strong>Security rules</strong> decide who may read or write which path, enforced on Google&rsquo;s side</>,
          <>It is deliberately simple — no joins, no complex queries — which is a good fit for small, frequent telemetry writes</>,
        ]}
      />

      <Sub>What a cloud-based dashboard is</Sub>
      <Prose>
        A <Term>cloud-based dashboard</Term> is a web interface that reads its data from a cloud service rather than
        from the device. It is hosted on the internet, so it works from any browser on any network, several people
        can look at the same data at once, and it keeps working when the device is switched off, because the last
        known values and the history are in the database, not on the board. The dashboard never talks to the ESP32 —
        both only ever talk to Firebase.
      </Prose>

      <Sub>Authentication and the purpose of a login system</Sub>
      <Prose>
        <Term>Authentication</Term> is the process of proving who you are — with a password, a Google account, a
        one-time code. A login system exists because this dashboard can switch a real appliance: without one, anyone
        who found the URL could read the data and toggle the bulb. Firebase Authentication handles the hard parts
        — storing credentials safely, issuing signed ID tokens, session refresh — and supports Google sign-in and
        email/password, both of which are enabled here.
      </Prose>

      <Sub>Difference between authentication and authorization</Sub>
      <CardGrid
        columns={2}
        items={[
          { icon: <KeyRound size={22} />, title: "Authentication — who are you?", subtitle: "Identity", body: "Checks a credential and establishes an identity. Outcome: a signed-in user with an ID token. In this build: Google sign-in or email + password through Firebase Auth." },
          { icon: <ShieldCheck size={22} />, title: "Authorization — what may you do?", subtitle: "Permission", body: "Decides which actions an identified user is allowed. Outcome: allow or deny per read or write. In this build: the Realtime Database rules." },
        ]}
      />
      <Callout label="WHY THE DIFFERENCE MATTERS HERE">
        The <code>ProtectedRoute</code> redirect only hides the dashboard page for people who are not signed in — a
        usability layer. The thing that actually stops a stranger who knows the database URL is the rule{" "}
        <code>auth != null</code>, which is authorization enforced by Firebase. Login without rules is a locked
        front door on a house with no walls.
      </Callout>
      <CodeBlock filename="database.rules.json">{T4_RULES}</CodeBlock>

      <Sub>Firebase project setup documented</Sub>
      <Pipeline
        steps={[
          { title: "Create the project", meta: "console.firebase.google.com → Add project", body: "A project is the container for the database, auth users, rules and hosting. Analytics can stay off." },
          { title: "Register a web app", meta: "Project settings → Your apps → </>", body: "This produces the config object (API key, auth domain, database URL, project and app IDs) that the dashboard reads from environment variables." },
          { title: "Create the Realtime Database", meta: "Build → Realtime Database → Create", body: "Choose a region and start in locked mode; the real rules are set below." },
          { title: "Publish the security rules", meta: "Rules tab", body: "Paste database.rules.json so that only signed-in users can read or write." },
          { title: "Create a device user", meta: "Authentication → Users", body: "The ESP32 signs in as an ordinary email/password user, so the same rules that protect the dashboard also protect the device path." },
        ]}
      />

      <Sub>Firebase Authentication configuration documented</Sub>
      <Pipeline
        steps={[
          { title: "Open the sign-in methods", meta: "Build → Authentication → Sign-in method", body: "This is where each login mechanism is switched on." },
          { title: "Enable Email/Password", meta: "Provider", body: "Used by the dashboard form and by the ESP32." },
          { title: "Enable Google", meta: "Provider", body: "Set the public-facing project name and a support email; this gives one-click sign-in." },
          { title: "Authorise the domains", meta: "Settings → Authorized domains", body: "localhost for development plus the deployed dashboard domain; Google sign-in refuses to run from a domain not on the list." },
        ]}
      />

      <Sub>Realtime Database structure documented</Sub>
      <Diagram
        {...DIAGRAMS.t4Dbtree}
        alt="Realtime Database tree: appliances/bulbState, settings/mode and settings/ldrThreshold, and sensorData with push-id children holding temperature, humidity, ldr, bulbState, mode and timestamp"
        caption="Control state at the top, append-only history under /sensorData."
      />
      <PinTable
        rows={[
          ["/appliances/bulbState", "boolean", "Desired / actual relay state. Written by the dashboard (manual) or by the ESP32 (automatic)."],
          ["/settings/mode", "\"manual\" | \"automatic\"", "Who decides the relay: the user or the light sensor."],
          ["/settings/ldrThreshold", "number 0–4095", "ADC cut-over used in automatic mode (default 2500)."],
          ["/sensorData/<pushId>/…", "object", "One record per reading: temperature, humidity, ldr, bulbState, mode, timestamp."],
        ]}
        head={["Path", "Type", "Meaning"]}
      />

      <Sub>Database / data-flow architecture</Sub>
      <Diagram
        {...DIAGRAMS.t4Architecture}
        alt="Architecture: ESP32 and sensors, Firebase Realtime Database with Authentication, and the web dashboard; Adafruit IO bulb path shown dashed"
        caption="Firebase is the single source of truth; the device and the dashboard never talk to each other directly."
      />
      <Pipeline
        steps={[
          { title: "Sense", meta: "ESP32 · every 2 s", body: "A DHT11 gives temperature and humidity; an LDR on an analog pin gives light, averaged over a burst of samples to damp noise." },
          { title: "Publish", meta: "Firebase ESP Client", body: "The reading is written to the database over a secure connection; the board has signed in as a device user so the rules let it through." },
          { title: "Synchronise", meta: "Realtime Database", body: "Every connected listener is notified of the change — nobody polls." },
          { title: "Display", meta: "Web dashboard", body: "Listeners update the live tiles, chart and table the moment new data lands." },
          { title: "Control", meta: "Dashboard → database → ESP32", body: "A toggle writes /appliances/bulbState; the ESP32's open stream receives it and switches the relay." },
        ]}
      />
      <Diagram
        {...DIAGRAMS.t4AuthFlow}
        alt="Authentication flow: login page, Firebase Auth, AuthContext, ProtectedRoute and the dashboard, with the database rule that enforces authorization"
        caption="From credential to dashboard — identity first, then access."
      />

      <Sub>Hardware & firmware for this task</Sub>
      <SpecList
        items={[
          { name: "ESP32 DevKit", qty: "1", role: "Reads sensors, streams state, drives the relay" },
          { name: "DHT11", qty: "1", role: "Temperature and humidity on GPIO 4" },
          { name: "LDR + fixed resistor", qty: "1", role: "Light divider into GPIO 34 (ADC1)" },
          { name: "Relay module", qty: "1", role: "Bulb switching on GPIO 26 (as Task 2)" },
        ]}
      />
      <CollapsibleCode summary={`ESP32 firmware — live telemetry + manual control · ${T4_FIRMWARE.split("\n").length} lines (click to expand)`} filename="Task_04_Firebase_Live_Telemetry.ino">
        {T4_FIRMWARE}
      </CollapsibleCode>

      <Sub>Complete dashboard source code</Sub>
      <Prose>
        The dashboard is a small React app built with Vite. These are the files that make it up — authentication
        context, the route guard, the login page, the dashboard itself and its chart — and the complete project
        (including <code>package.json</code>, styles and <code>.env.example</code>) is in the repository.
      </Prose>
      <CollapsibleCode summary="src/context/AuthContext.jsx — session state" filename="src/context/AuthContext.jsx">{T4_AUTH_CONTEXT}</CollapsibleCode>
      <CollapsibleCode summary="src/components/ProtectedRoute.jsx — the route guard" filename="src/components/ProtectedRoute.jsx">{T4_GUARD}</CollapsibleCode>
      <CollapsibleCode summary="src/pages/Login.jsx — login page" filename="src/pages/Login.jsx">{T4_LOGIN}</CollapsibleCode>
      <CollapsibleCode summary={`src/pages/Dashboard.jsx — live tiles, controls, history · ${T4_DASHBOARD.split("\n").length} lines`} filename="src/pages/Dashboard.jsx">{T4_DASHBOARD}</CollapsibleCode>
      <CollapsibleCode summary="src/components/HistoryChart.jsx — SVG chart" filename="src/components/HistoryChart.jsx">{T4_CHART}</CollapsibleCode>
      <CollapsibleCode summary="src/utils/adafruit.js — Adafruit IO bulb publish" filename="src/utils/adafruit.js">{T4_ADAFRUIT}</CollapsibleCode>

      <Sub>Screenshots — login page, Firebase database and the working dashboard</Sub>
      <Diagram
        {...DIAGRAMS.t4AuthFlow}
        alt="Login page flow: Google or email and password, verified by Firebase Authentication"
        caption="Login page — the two sign-in routes and what happens next."
      />
      <Diagram
        {...DIAGRAMS.t4Dbtree}
        alt="Firebase Realtime Database console view as a tree: appliances, settings and sensorData"
        caption="Firebase Realtime Database — the tree the console shows, with a push-id record expanded."
      />
      <Diagram
        {...DIAGRAMS.t4DashboardLayout}
        alt="Dashboard layout: live temperature, humidity, light and bulb tiles; controls; CSV download; history chart and table"
        caption="Working dashboard — live tiles, controls, chart and history table."
      />

      <Sub>The webpage workflow</Sub>
      <Pipeline
        steps={[
          { title: "Open the dashboard URL", meta: "/", body: "Signed-out visitors see only the login page." },
          { title: "Sign in", meta: "Google or email + password", body: "Firebase verifies the credential; AuthContext learns about the session through onAuthStateChanged." },
          { title: "Reach /dashboard", meta: "ProtectedRoute", body: "The guard lets a signed-in user through and redirects everyone else back to the login page." },
          { title: "Watch live data", meta: "Realtime listeners", body: "Tiles show the latest reading; the chart and table fill from the history." },
          { title: "Switch the bulb", meta: "Toggle", body: "Writes /appliances/bulbState (and publishes to the Adafruit IO feed); the relay follows within about a second." },
          { title: "Sign out", meta: "Header", body: "The session ends and the guard sends the browser back to the login page." },
        ]}
      />

      <Sub>Auth, and the key that couldn&rsquo;t ship</Sub>
      <Prose>
        The more interesting problem came next, and it is the one I learned the most from. Controlling the bulb
        from the dashboard means calling the Adafruit IO API, which needs the account key. The obvious move is to put
        that key in the front-end and call the API directly from the browser.
      </Prose>
      <Prose className="mt-4">
        That is a bad idea, and the reason is worth being precise about. Adafruit&rsquo;s key is an{" "}
        <Term>account-wide master key</Term>, not a credential scoped to one feed. Anything shipped to the browser is
        readable — open the network tab and it is right there. So exposing it would not just let a stranger toggle a
        bulb; it would hand them read and write access to every feed on the account. The blast radius is the whole
        account, not the one device.
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
      <CollapsibleCode summary="functions/src/index.ts — the server-side version (written, not shippable)" filename="functions/src/index.ts">{SECRET_CODE}</CollapsibleCode>
      <Prose className="mt-6">
        Then reality intervened. Cloud Functions can only make outbound calls to non-Google services on the paid
        plan, and the billing upgrade would not go through — a known regional payment issue, not something I could
        code around. The secure design was written, correct, and unshippable.
      </Prose>
      <Callout label="THE TRADE-OFF I ACTUALLY MADE">
        Rather than stall, I moved the calls back into the browser with the key in an environment variable —
        accepting the exact exposure described above, with eyes open. What makes that defensible is the scope: a hobby
        feed, on a throwaway account, controlling one bulb, with nothing else of value behind the same credential.
        What makes it temporary is that the server-side version already exists; restoring it is a change to two
        imports once billing clears.
        <br />
        <br />
        The lesson was not &ldquo;never put keys in the client&rdquo; — I already knew that rule. It was that the
        rule is a shorthand for a threat model, and when you actually work the threat model through, you can tell the
        difference between a risk you must not take and one you can take deliberately, cheaply reverse, and write it
        down.
      </Callout>

      <Sub>Problems encountered & their solutions</Sub>
      <ProblemList
        items={[
          { problem: <>The Adafruit IO key could not be kept secret from a browser-only dashboard.</>, solution: <>Wrote the Cloud Function version (above), then — blocked by billing — shipped the documented, deliberately-scoped fallback of an environment variable, with the server-side code ready to swap in.</> },
          { problem: <>A login page alone left the data readable to anyone who knew the database URL.</>, solution: <>Moved the real access control into the Realtime Database rules (<code>auth != null</code>) and made the ESP32 sign in as a user too.</> },
          { problem: <>A bare LDR reading jumped around between samples.</>, solution: <>Averaged a burst of 15 reads before using the value.</> },
          { problem: <>The dashboard showed a state the hardware was not actually in after an automatic decision.</>, solution: <>The ESP32 writes the resulting state back to <code>/appliances/bulbState</code> so the dashboard reflects reality.</> },
        ]}
      />

      <Sub>Brief reflection on the assignment</Sub>
      <Callout label="REFLECTION">
        Very little of the difficulty was in the embedded code. It was in the seams: who is allowed to write to the
        database, what the dashboard shows when the device has decided something on its own, and where a secret may
        safely live. Authentication, authorization and the cloud service model stopped being vocabulary and became the
        decisions that shaped the system.
      </Callout>

      <Sub>Repository files</Sub>
      <RepoFiles
        folder="Task-04-Firebase-Dashboard"
        files={[
          { name: "firmware/Task_04_Firebase_Live_Telemetry.ino", note: "ESP32 sketch", path: "blob/main/Task-04-Firebase-Dashboard/firmware/Task_04_Firebase_Live_Telemetry.ino" },
          { name: "dashboard/", note: "React + Vite dashboard (all source)", path: "tree/main/Task-04-Firebase-Dashboard/dashboard" },
          { name: "database.rules.json", note: "Realtime Database security rules", path: "blob/main/Task-04-Firebase-Dashboard/database.rules.json" },
          { name: "README.md", note: "project setup, auth config and database structure" },
        ]}
      />
    </WeekSection>
  );
}
