# 🌍 Fluento — AI Language Learning Chatbot

A Duolingo-style AI language tutor built with HTML, CSS, JavaScript + Groq AI.

---

## 📁 Project Structure

```
fluento/
├── index.html        ← Main HTML file (open this in browser)
├── css/
│   └── style.css     ← All styles
├── js/
│   ├── data.js       ← Languages & lesson data
│   └── app.js        ← App logic + Groq API calls
└── README.md         ← This file
```

---

## 🚀 Setup (5 minutes)

### Step 1 — Get a FREE Groq API Key
1. Go to → https://console.groq.com
2. Sign up with your email (free, no card needed)
3. Click **"Create API Key"**
4. Copy the key (starts with `gsk_...`)

### Step 2 — Add your API Key
1. Open `js/app.js` in VS Code
2. Find line 7:
   ```js
   const GROQ_API_KEY = 'YOUR_GROQ_API_KEY_HERE';
   ```
3. Replace `YOUR_GROQ_API_KEY_HERE` with your actual key:
   ```js
   const GROQ_API_KEY = 'gsk_abc123yourrealkeyhere';
   ```
4. Save the file (Ctrl+S)

### Step 3 — Run the Project
**Option A — Simple (open directly):**
- Double-click `index.html` → opens in Chrome/Edge/Firefox
- Done! ✅

**Option B — VS Code Live Server (recommended for demo):**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. App opens at `http://127.0.0.1:5500`

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌍 Languages | 12 languages: Japanese, Spanish, French, Hindi, Korean, German, Mandarin, Arabic, Italian, Portuguese, Russian, Turkish |
| 🗺️ Roadmap | 4 stages × 4 lessons = 16 lessons per language (Beginner → Advanced) |
| 🔓 Unlock System | Lessons unlock progressively like Duolingo |
| 🤖 AI Tutor | Powered by Groq (Llama 3) — teaches, corrects, guides |
| ⚡ XP System | Earn XP for correct answers, level up |
| 🔥 Streak | Streak counter resets on wrong answers |
| ✓ Corrections | Real-time correction with grammar tips |
| 📖 Phrase Card | Phrase of the moment shown during each lesson |

---

## 🛠️ Tech Stack

- **HTML5** — Structure
- **CSS3** — Styling (no frameworks, pure CSS)
- **JavaScript (ES6+)** — App logic
- **Groq API** — AI tutor (Llama 3 model, free tier)
- **Google Fonts** — Nunito + Righteous

---

## 🎯 How to Present at Expo

1. Open the app → pick a language (Japanese or Spanish works best for demo)
2. Show the roadmap — explain the unlock system
3. Click "Greetings & Hello" (first lesson)
4. Chat with the AI tutor — type something wrong on purpose to show corrections
5. Show the XP bar going up and streak counter
6. Explain: "Built with Groq AI (Llama 3) — free, fast, runs in any browser"

---

## ❓ Troubleshooting

**AI not responding?**
- Check your API key is correct in `js/app.js`
- Make sure you're connected to the internet
- Open browser DevTools (F12) → Console tab to see errors

**CORS error in browser?**
- Use VS Code Live Server instead of opening the file directly
- Or use Chrome with `--disable-web-security` flag (for local demo only)

---

