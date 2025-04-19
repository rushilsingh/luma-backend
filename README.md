# Luma Backend

Luma is a developer-focused backend tool that audits any public website using Google's Lighthouse engine and returns an AI-generated summary of the most impactful performance, accessibility, SEO, and best practices issues.

This repo contains the backend-only MVP — the core logic is complete and can be extended with a frontend or deployed to production.

---

## 🚀 Features

- 📊 Runs a Lighthouse audit using Puppeteer
- 🧠 Summarizes results with OpenAI (GPT-3.5)
- 📦 Outputs a clean JSON payload with:
  - Category scores
  - Low-scoring audits
  - Natural language summary of problems and suggested fixes

---

## ⚙️ Tech Stack

- Node.js + Express
- Puppeteer (headless Chrome)
- OpenAI API (GPT-3.5)
- Lighthouse (programmatic API)

---

## 🧪 Example Usage (Local)

```bash
curl -s -X POST http://localhost:3001/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://rushilsingh.dev"}' | jq
```

---

## 📦 Deployment

Luma is currently deployed on **Render (Free tier)** and can be tested live via:

```http
POST https://luma-backend-4gv5.onrender.com/analyze
Content-Type: application/json

{ "url": "https://rushilsingh.dev" }
```

### ⚠️ Note:

- **Render Free** spins down the server after inactivity.  
  👉 **First request may take 30–60 seconds** to respond.
- Puppeteer and Lighthouse are resource-heavy.  
  On the Free tier, audits may time out or fail intermittently.
- For stable performance, consider:
  - Render Pro ($7/month)
  - Docker-based deploy on Fly.io or Railway
  - VPS (Hetzner, DigitalOcean) with headless Chrome

---

## 🛠 Local Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/rushilsingh/luma-backend
   cd luma-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:

   ```env
   OPENAI_API_KEY=sk-...
   ```

4. Start the server:
   ```bash
   node server.js
   ```

---

## 🧠 Next Steps (Optional)

- Frontend UI with Vite + Tailwind (see: `luma-frontend`)
- Chrome extension to audit current tab
- Slack bot for on-demand audit summaries
- GPT function-calling for structured fix recommendations

---

## 📄 License

MIT
