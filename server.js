import express from 'express';
import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { URL } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const wsEndpoint = browser.wsEndpoint();
    const chrome = new URL(wsEndpoint);
    const options = {
      logLevel: 'info',
      output: 'json',
      port: chrome.port,
    };

    const runnerResult = await lighthouse(url, options);

    const categories = runnerResult.lhr.categories;
    const audits = runnerResult.lhr.audits;

    const summary = {
      url: runnerResult.lhr.finalUrl,
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
    };

    const lowScoringAudits = Object.entries(audits)
      .filter(([_, a]) => a.score !== null && a.score < 0.9)
      .map(([key, a]) => ({
        id: key,
        title: a.title,
        score: a.score,
        description: a.description,
      }));

    const prompt = `
You are a senior web performance engineer.

A Lighthouse audit was run on: ${url}

Category Scores:
- Performance: ${summary.performance}%
- Accessibility: ${summary.accessibility}%
- Best Practices: ${summary.bestPractices}%
- SEO: ${summary.seo}%

The following issues were detected:
${lowScoringAudits.map((a) => `• [${Math.round(a.score * 100)}%] ${a.title}: ${a.description}`).join('\n')}

Please provide a plain-English summary that includes:
1. The top 3–5 most important issues (ranked by user impact)
2. Why each issue matters in practical terms
3. Suggested fixes or techniques for each (brief but specific)
4. An overall prioritization strategy (what to fix first and why)

Output should be under 300 words and focused on helping a frontend developer take action.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you're approved
      messages: [{ role: 'user', content: prompt }],
    });

    const explanation = completion.choices[0].message.content;

    res.json({ summary, suggestions: lowScoringAudits, explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Luma backend running on port ${PORT}`);
});

