# Agentic Review Article Generator

Next.js application that ingests product pages, orchestrates ChatGPT copywriting, performs inline spell-checking, and manages Nano Banana image prompts for affiliate review workflows focused on SEO + GEO performance.

## Features

- Product intelligence ingestion powered by heuristic scraping (title, description, specs, breadcrumbs, imagery)
- Configurable GEO, locale, tone, keyword, competitor, and custom directives for precise prompting
- Affiliate inventory manager covering Amazon, Mercado Livre, Shopee, Magalu, Clickbank, Hotmart, Eduzz, Kiwify, Braip (and custom additions)
- ChatGPT-driven Markdown article generation with Discovery-compatible sections, schema, CTAs, review personas, and image prompts
- Built-in spell checker (nspell + dictionary-en) surfacing potential issues alongside suggestions
- Nano Banana image generator integration with prompt logger and status feedback
- Live Markdown preview with sanitised rendering and Tailwind-powered dark UI

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Create `.env.local` at the project root:
   ```bash
   OPENAI_API_KEY=sk-...
   OPENAI_MODEL=gpt-4o-mini
   NANO_BANANA_API_KEY=nb-...
   # Optional override
   # NANO_BANANA_ENDPOINT=https://api.nanobanana.ai/v1/generate
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Tech Stack

- Next.js 14 (App Router, Server Actions)
- React 18 + SWR + Tailwind CSS
- OpenAI SDK (`gpt-4o-mini` default model, configurable)
- `cheerio` for scraping, `nspell` + `dictionary-en` for spell-checking
- `react-markdown` + `remark-gfm` + DOMPurify preview renderer

## Deployment

Ready for Vercel. Ensure the following environment variables are configured in the Vercel dashboard or CLI before deploying:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional)
- `NANO_BANANA_API_KEY`
- `NANO_BANANA_ENDPOINT` (optional)

Then run:
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-180b69f7
```

## Notes

- Scraping quality depends on publicly accessible metadata from the product URL.
- Spell checking currently targets English wordlists; extend by swapping the dictionary package if required for other languages.
- Nano Banana integration assumes JSON API compatibility using `{ prompt, aspect_ratio }` payloads and Bearer token auth.
