<div align="center">

# 🎭 MoodStream

### *Watch How You Feel*

**An AI-powered streaming platform that detects your emotion and curates personalised movies, music & videos — in seconds.**

[![Made with React](https://img.shields.io/badge/Made%20with-React-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Powered by Groq](https://img.shields.io/badge/Powered%20by-Groq%20LLM-f55036?style=flat-square)](https://groq.com)
[![Model](https://img.shields.io/badge/Model-LLaMA%203.3%2070B-blueviolet?style=flat-square)](https://groq.com)
[![No Build Required](https://img.shields.io/badge/No%20Build-Just%20Open-34d399?style=flat-square)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## About

MoodStream bridges the gap between **how you feel** and **what you watch**. Instead of endlessly scrolling through Netflix or Spotify, you describe your mood in plain words and the app's AI does the rest.

It uses **Groq's LLaMA 3.3 70B** model to read your emotional context, classify it into one of 8 emotion categories, and instantly surface curated content across movies, music, and YouTube — matched to your current headspace.

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge)
- A free Groq API key → [console.groq.com](https://console.groq.com)
- Python 3+ *(optional, only if using the split file structure)*

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Abhisheksk2005/EmotionBasedStreamingPlatform.git
cd EmotionBasedStreamingPlatform
```

### 2. Add your Groq API key

Open `index.html` and find line **541**. Replace the empty string with your key:

```js
const [apiKey, setApiKey] = useState('your_gsk_key_here');
```

> Get a free key at [console.groq.com](https://console.groq.com) → API Keys → Create new key.
> **Never commit your key to GitHub.**

### 3. Open the app

```bash
# Option A — just double-click index.html in your file explorer
# Option B — run a local server
python3 -m http.server 8080
```

Then open:

- **App** → http://localhost:8080

That's it. No installs, no build step, no dependencies.

---

## How It Works

1. **Describe your mood** — type how you're feeling or tap a word chip
2. **Set your energy level** — drag the slider from drained to wired
3. **Choose your intent** — escape / relate / energize / relax
4. **AI analyses your input** — Groq LLM classifies your emotion with a confidence score and reasoning
5. **Get your recommendations** — movies, music, and YouTube picks tailored to your mood

---

## Emotion Categories

| Emotion | Content Style |
|---------|--------------|
| 😊 Happy | Comedies, upbeat pop, funny videos |
| 😢 Melancholic | Drama, indie folk, emotional shorts |
| 😰 Anxious | Calming films, ambient music, ASMR |
| 🔥 Excited | Action, high-energy music, sports highlights |
| 🌊 Calm | Gentle films, acoustic sets, slow TV |
| 😤 Frustrated | Cathartic movies, rock/metal, satisfying videos |
| 💖 Romantic | Romance films, love songs, sunset timelapses |
| 😑 Bored | Mind-bending films, psychedelic music, science |

---

## Project Structure

```
EmotionBasedStreamingPlatform/
├── index.html           ← Self-contained app (open directly)
├── css/
│   └── styles.css       ← Styles, animations & CSS variables
└── js/
    ├── data.js          ← Content database & emotion config
    ├── engine.js        ← Groq LLM call + offline fallback
    ├── components.js    ← Reusable React components
    └── app.js           ← Main App & screen state machine
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (CDN, no build step) |
| AI / LLM | Groq API — `llama-3.3-70b-versatile` |
| Styling | Custom CSS with variables & keyframe animations |
| Transpiler | Babel Standalone |
| Hosting | GitHub Pages, Vercel, or Netlify |

---

## Features

- 🧠 **LLM emotion detection** with confidence score and plain-English reasoning
- 🎬 **Movies** with genre, year, and star ratings
- 🎵 **Music** with artist and genre tags
- 📺 **YouTube** with channel-specific recommendations
- 💖 **Secondary emotion** detection when two feelings are present
- ⚡ **Offline fallback** via keyword matching — works without an API key
- 🌈 **Dynamic theming** — colours and gradients shift per emotion
- 🔒 **Privacy first** — no backend, no login, no data stored

---

## Roadmap

- [ ] TMDB API for live movie data
- [ ] Spotify API for playable playlists
- [ ] Mood history journal with charts
- [ ] Shareable mood result cards
- [ ] Deploy to Vercel

---

## Contributing

Pull requests are welcome. Fork the repo, make your changes, and open a PR.

---

## License

MIT License — use it, build on it, make it yours.

---

<div align="center">

Made with ❤️ by **Prasad** · Powered by [Groq](https://groq.com)

*Your mood deserves better than an algorithm.*

</div>
