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

## 🧪 Example Usage

```bash
curl -s -X POST http://localhost:3001/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://rushilsingh.dev"}' | jq
```

### 🔍 Sample Output

```json
{
  "summary": {
    "url": "https://rushilsingh.dev/",
    "performance": 82,
    "accessibility": 92,
    "bestPractices": 100,
    "seo": 100
  },
  "suggestions": [...],
  "explanation": "1. The website has several performance issues..."
}
```

---

## 🛠 Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/rushilsingh/luma-backend
   cd luma-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your API keys:

   ```env
   OPENAI_API_KEY=sk-...
   ```

4. Start the server:
   ```bash
   node server.js
   ```

---
