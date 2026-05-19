# AGENT Friday — AI Voice Assistant

A modern, fully voice-controlled AI assistant built with React, Node.js, Express, Groq LLM, and SerpAPI. Features a sleek dark UI with animated background blobs, real-time system monitoring, live voice visualization, and intelligent command execution — JARVIS-inspired.

---

## Features

### Voice & Input

- **Full Voice Control** — Listen, understand, and execute commands via the Web Speech API. Continuous speech recognition with interim transcript display.
- **Text Input** — Sidebar textarea for typing commands when voice isn't practical. Enter to submit, supports multi-line input.
- **Female Voice Response** — Automatically selects a female TTS voice from available browser voices (Zira, Samantha, Karen, etc.). Falls back to default if none found.
- **Ctrl + Q / Stop Button** — Instantly cancels speech and returns to listening mode.
- **Blob Visualizer** — Central animated blob changes color and animation by state:
  - **Idle**: Cyan glow, static at bottom-left
  - **Listening**: Bright cyan-blue, pulsing scale at bottom-left
  - **Speaking**: Green gradient, pulse animation at bottom-left

### Command Processing

- **Intelligent Classification** — Groq's `llama-3.3-70b-versatile` classifies commands into: `search`, `question`, `weather`, `open_website`, `close_tab`, `delete_history`.
- **Question Answering** — LLM responds in a JARVIS persona ("sir", concise, precise). Cites sources when using web context.
- **Web Search** — Multi-engine search with spoken summaries:
  | Engine | Source |
  |--------|--------|
  | Google | Serper.dev API |
  | YouTube | Direct search URL |
  | Wikipedia | Direct search URL |
  | Facebook | Direct search URL |
  | Twitter / X | Direct search URL |
  | GitHub | Direct search URL |

- **Weather** — Open-Meteo API (free, no key). Shows temperature, conditions, humidity, wind. Generates spoken summary via LLM.
- **Open/Close Websites** — Voice commands to open sites in current or specified browser.
- **Delete History** — Clear all stored commands (in-memory).

### Real-Time Dashboard

- **Background Blobs** — 8 animated gradient blobs floating and morphing across the background with cyan, purple, green, pink, blue, and gold hues. Each has unique size, speed, blur, and drift path.
- **Dot Grid** — Subtle animated dot pattern overlay for depth.
- **Blurred Deep Space Background** — Fixed blurred background image with reduced brightness.
- **Reactor Logo** — Spinning concentric ring logo (cyan, top-left) with pulsing core.
- **Tab Favicon** — Pink/orange reactor icon for browser tab visibility.

### Sidebar

- **Weather Card** — Location, temperature, conditions, feels-like, humidity.
- **System Monitor** — Real-time hardware stats (polls every 5s):
  - OS platform & hostname
  - Server uptime (formatted)
  - CPU usage % (computed from tick deltas, works on Windows/Linux/macOS)
  - RAM usage bar (used / total MB)
- **Text Command Input** — Textarea at sidebar bottom for typing commands.

### Result Display

- Word-by-word staggered CSS fade-in animation (no JS interval — race-condition free).
- Source citations with clickable links.
- Source type labels (Web Search / Powered by LLM / Weather).

---

## Tech Stack

| Layer           | Technology                                                         |
| --------------- | ------------------------------------------------------------------ |
| **Frontend**    | React 18.3.1, Axios 1.7.2, Web Speech API                          |
| **Backend**     | Node.js, Express 4.19.2                                            |
| **LLM**         | Groq SDK 0.5.0 (`llama-3.3-70b-versatile`)                         |
| **Search**      | Serper.dev (Google), direct URL routing (YouTube, Wikipedia, etc.) |
| **Weather**     | Open-Meteo API (free, no key)                                      |
| **System Info** | Node.js `os` module                                                |

---

## Project Structure

```
AGENT Friday/
├── server/
│   ├── .env                          # API keys & config
│   ├── package.json
│   ├── server.js                     # Express entry, route registration
│   ├── routes/
│   │   ├── command.js                # POST /process, GET /history, DELETE /history
│   │   ├── weather.js                # GET /current, GET /by-city
│   │   └── system.js                 # GET /info (CPU, RAM, OS)
│   ├── controllers/
│   │   ├── commandController.js      # In-memory command storage
│   │   └── systemController.js       # OS stats aggregator
│   └── services/
│       ├── groqService.js            # LLM classification, Q&A, summarization
│       ├── searchService.js          # Multi-engine search
│       └── weatherService.js         # Open-Meteo weather fetch
├── client/
│   ├── package.json
│   ├── public/
│   │   ├── index.html                # Tab title, favicon
│   │   └── logo.svg                  # Pink/orange reactor favicon
│   └── src/
│       ├── App.js                    # Main layout & state orchestration
│       ├── index.js                  # React entry
│       ├── hooks/
│       │   └── useVoice.js           # Voice recognition, TTS, command processing, system polling
│       ├── components/
│       │   ├── BlobAnimation.js      # State-responsive animated blob
│       │   ├── BackgroundBlobs.js    # Floating background gradient blobs
│       │   ├── ReactorLogo.js        # Spinning reactor icon (dashboard)
│       │   ├── ResultDisplay.js      # Results with CSS word animation & sources
│       │   ├── LiveTranscript.js     # Live speech-to-text display
│       │   └── Sidebar.js            # Weather, system monitor, text input
│       └── styles/
│           ├── App.css               # Global styles, blob, glassmorphism, system bars
│           ├── BackgroundBlobs.css   # Floating blob animations
│           └── ReactorLogo.css       # Reactor rings & core pulse
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+

### 1. Backend

```bash
cd server
npm install
```

Create `.env` in `server/`:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
SERP_API_KEY=your_serp_api_key_here
```

```bash
npm start                                   # or: npm run dev (nodemon)
```

Server runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd ../client
npm install
npm start
```

Frontend runs on `http://localhost:3000`. Defaults proxy to port 5000.

---

## API Keys

| Key                      | Required For                               | Link                                                   |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------ |
| **Groq API Key**         | Command classification, Q&A, summarization | [console.groq.com/keys](https://console.groq.com/keys) |
| **SerpAPI / Serper Key** | Google search                              | [serper.dev](https://serper.dev)                       |
| Open-Meteo               | Weather                                    | Free, no key required                                  |

---

## Usage

1. Open `http://localhost:3000` in Chrome/Edge (Web Speech API support required).
2. Click **🎤 Start Listening** or wait for auto-listen.
3. Speak a command naturally — results appear with animated text.
4. Type commands in the sidebar textarea as an alternative.
5. Press **Ctrl + Q** or click **Stop Speaking** to interrupt.
6. Monitor system health in the right sidebar.

### Example Commands

| Command                              | Action                                  |
| ------------------------------------ | --------------------------------------- |
| "Search for AI news on Google"       | Google search with spoken summary       |
| "Search YouTube for React tutorials" | Opens YouTube search                    |
| "What's the weather today?"          | Weather summary for configured location |
| "Open youtube.com"                   | Opens YouTube in a new tab              |
| "Open facebook in chrome"            | Concept (browser routing)               |
| "Close YouTube tab"                  | Concept (tab management)                |
| "What is the capital of France?"     | LLM-powered answer                      |
| "Delete all the info"                | Clears in-memory command history        |

---

## API Endpoints

| Method   | Endpoint                        | Description                     |
| -------- | ------------------------------- | ------------------------------- |
| `GET`    | `/api/health`                   | Server health check             |
| `POST`   | `/api/command/process`          | Classify & execute a command    |
| `GET`    | `/api/command/history`          | Paginated command history       |
| `DELETE` | `/api/command/history`          | Clear all command history       |
| `GET`    | `/api/weather/current`          | Weather for configured location |
| `GET`    | `/api/weather/by-city?city=...` | Weather by city name            |
| `GET`    | `/api/system/info`              | CPU, RAM, OS stats               |

---

## Future Implementations

### Core Enhancements

- [ ] **Multi-Language Support** — Voice recognition & responses in 10+ languages.
- [ ] **Conversation Memory** — Persistent chat history with context across sessions using vector embeddings.
- [ ] **Streaming Responses** — Token-by-token streaming from Groq for faster perceived response.
- [ ] **Wake Word Detection** — "Hey Friday" continuous listening without button press.
- [ ] **Offline Mode** — Local LLM fallback (Ollama / LM Studio) when Groq is unavailable.

### Integrations

- [ ] **Spotify / Music Control** — Play, pause, skip, search by voice.
- [ ] **Smart Home** — MQTT / Home Assistant integration for lights, thermostats, locks.
- [ ] **Email & Calendar** — Gmail / Outlook integration for reading, composing, scheduling.
- [ ] **Reminders & Alarms** — Set time-based or location-based reminders.
- [ ] **News Briefing** — Curated daily news summary from RSS / NewsAPI.
- [ ] **File System Operations** — Open, search, rename files by voice (Electron context).

### UI / UX

- [ ] **Dark / Light Theme Toggle** — With system preference detection.
- [ ] **Customizable Widgets** — Drag-and-drop dashboard layout.
- [ ] **Voice Waveform Visualizer** — Real microphone audio levels instead of simulated random.
- [ ] **Notification Toasts** — Non-intrusive alerts for background tasks.
- [ ] **Mobile PWA** — Progressive Web App with responsive layout.

### Platform

- [ ] **Desktop App** — Electron wrapper with system tray, global hotkeys, native notifications.
- [ ] **Docker Deployment** — Single `docker-compose up` for backend.
- [ ] **Authentication** — User accounts, OAuth (Google/GitHub), per-user history.
- [ ] **Plugin System** — Community extensions for custom commands and integrations.

### Intelligence

- [ ] **Sentiment Analysis** — Detect user mood and adjust response tone.
- [ ] **Image Generation** — DALL·E / Stable Diffusion integration for visual responses.
- [ ] **Screen Capture & OCR** — Read on-screen text and answer questions about it.
- [ ] **Code Execution Sandbox** — Run and explain code snippets.
- [ ] **Agent Chains** — Multi-step autonomous task execution (LangChain-style).

---

## License

MIT

---

## Author

Built with modern web technologies.
