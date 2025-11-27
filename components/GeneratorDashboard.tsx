"use client";

import { useMemo, useState, useTransition } from "react";
import { AffiliateLink, AffiliateLinksInput } from "@/components/AffiliateLinksInput";
import { ProductInsightsCard } from "@/components/ProductInsightsCard";
import { SpellcheckPanel } from "@/components/SpellcheckPanel";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import {
  generateArticleAction,
  nanoBananaAction,
  scrapeProductAction
} from "@/app/actions";
import { ProductScrapeResult } from "@/lib/productScraper";
import type { SpellIssue } from "@/lib/spellcheck";

interface NanoBananaLog {
  prompt: string;
  aspectRatio: string;
  status: string;
  imageUrl?: string;
  error?: string;
}

export function GeneratorDashboard() {
  const [productUrl, setProductUrl] = useState("");
  const [geoFocus, setGeoFocus] = useState("Brazil");
  const [locale, setLocale] = useState("pt-BR");
  const [tone, setTone] = useState("expert yet approachable journalist with transparent tone");
  const [targetKeywords, setTargetKeywords] = useState("melhor review, análise completa");
  const [competitorUrls, setCompetitorUrls] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [scrapeState, setScrapeState] = useState<{
    loading: boolean;
    data?: ProductScrapeResult;
    error?: string;
  }>({ loading: false });
  const [generationState, setGenerationState] = useState<{
    markdown: string;
    spellIssues: SpellIssue[];
    generating: boolean;
  }>({ markdown: "", spellIssues: [], generating: false });
  const [imagePrompt, setImagePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [imageLogs, setImageLogs] = useState<NanoBananaLog[]>([]);
  const [isPending, startTransition] = useTransition();

  const productReady = useMemo(
    () => scrapeState.data ?? undefined,
    [scrapeState.data]
  );

  const triggerScrape = async () => {
    if (!productUrl) return;
    setScrapeState({ loading: true });
    const result = await scrapeProductAction(productUrl);
    if (result.ok) {
      setScrapeState({ loading: false, data: result.data });
    } else {
      setScrapeState({ loading: false, error: result.error });
    }
  };

  const triggerGeneration = () => {
    if (!productUrl) return;

    setGenerationState((current) => ({
      ...current,
      generating: true
    }));

    startTransition(async () => {
      try {
        const payload = {
          productUrl,
          geoFocus,
          locale,
          tone,
          targetKeywords: targetKeywords
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean),
          competitorUrls: competitorUrls
            .split(/\n|,/)
            .map((item) => item.trim())
            .filter(Boolean),
          affiliateLinks: affiliateLinks
            .filter((link) => link.platform && link.url)
            .map((link) => ({ platform: link.platform, url: link.url })),
          includeImagePrompts: true,
          referenceData: {
            title: productReady?.title,
            description: productReady?.description,
            features: productReady?.features,
            technical: productReady?.technical,
            price: productReady?.price,
            breadcrumbs: productReady?.breadcrumbs
          },
          customInstructions: customInstructions || undefined
        };

        const generated = await generateArticleAction(payload);
        setGenerationState({
          markdown: generated.markdown,
          spellIssues: generated.spellIssues,
          generating: false
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Generation failed.";
        setGenerationState({
          markdown: `Generation failed: ${message}`,
          spellIssues: [],
          generating: false
        });
      }
    });
  };

  const triggerNanoBanana = async () => {
    if (!imagePrompt) return;
    const log: NanoBananaLog = {
      prompt: imagePrompt,
      aspectRatio,
      status: "Queued"
    };
    setImageLogs((logs) => [log, ...logs]);

    const result = await nanoBananaAction({
      prompt: imagePrompt,
      aspectRatio
    });

    setImageLogs((logs) =>
      logs.map((entry) =>
        entry.prompt === log.prompt && entry.aspectRatio === log.aspectRatio
          ? result.ok && result.job
            ? {
                ...entry,
                status: result.job.status,
                imageUrl: result.job.imageUrl,
                error: result.job.error
              }
            : {
                ...entry,
                status: "failed",
                error: result.error
              }
          : entry
      )
    );
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 p-8 md:grid-cols-[420px,1fr]">
      <div className="space-y-6">
        <div className="card space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              GEO + SEO review article generator
            </h1>
            <p className="text-sm text-slate-400">
              Ingest product intelligence, craft veracity-first reviews, inject affiliate CTAs,
              and feed Nano Banana image prompts.
            </p>
          </div>
          <div className="space-y-3">
            <label className="label">Product URL</label>
            <input
              className="input"
              value={productUrl}
              onChange={(event) => setProductUrl(event.target.value)}
              placeholder="https://..."
            />
            <button
              type="button"
              className="button-primary"
              onClick={triggerScrape}
              disabled={!productUrl || scrapeState.loading || isPending}
            >
              {scrapeState.loading ? "Scraping…" : "Ingest product data"}
            </button>
          </div>
        </div>

        <div className="card space-y-4">
          <div className="grid gap-3">
            <div>
              <label className="label">Geo focus</label>
              <input
                className="input"
                value={geoFocus}
                onChange={(event) => setGeoFocus(event.target.value)}
              />
            </div>
            <div>
              <label className="label">Locale (IETF)</label>
              <input
                className="input"
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
              />
            </div>
            <div>
              <label className="label">Tone directives</label>
              <input
                className="input"
                value={tone}
                onChange={(event) => setTone(event.target.value)}
              />
            </div>
            <div>
              <label className="label">Target keywords</label>
              <input
                className="input"
                value={targetKeywords}
                onChange={(event) => setTargetKeywords(event.target.value)}
                placeholder="Comma-separated keywords"
              />
            </div>
            <div>
              <label className="label">Competitor URLs</label>
              <textarea
                className="input min-h-[80px]"
                value={competitorUrls}
                onChange={(event) => setCompetitorUrls(event.target.value)}
                placeholder="One URL per line or comma separated"
              />
            </div>
            <div>
              <label className="label">Custom instructions</label>
              <textarea
                className="input min-h-[80px]"
                value={customInstructions}
                onChange={(event) => setCustomInstructions(event.target.value)}
                placeholder="Optional directives for the model"
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Affiliate inventory</h2>
            <p className="text-xs text-slate-500">
              Inject your monetization URLs. Each will be referenced contextually across the article.
            </p>
          </div>
          <AffiliateLinksInput value={affiliateLinks} onChange={setAffiliateLinks} />
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-white">Nano Banana imagery</h2>
          <div className="space-y-3 text-sm">
            <label className="label">Prompt</label>
            <textarea
              className="input min-h-[80px]"
              value={imagePrompt}
              onChange={(event) => setImagePrompt(event.target.value)}
              placeholder="Describe the visual you need..."
            />
            <label className="label">Aspect ratio</label>
            <input
              className="input"
              value={aspectRatio}
              onChange={(event) => setAspectRatio(event.target.value)}
            />
            <button type="button" className="button-primary" onClick={triggerNanoBanana}>
              Send to Nano Banana
            </button>
          </div>
          {imageLogs.length > 0 && (
            <div className="space-y-3 text-xs">
              {imageLogs.map((log, index) => (
                <div key={index} className="rounded border border-slate-800 p-3">
                  <div className="font-semibold text-slate-200">{log.prompt}</div>
                  <div className="text-slate-500">Aspect ratio: {log.aspectRatio}</div>
                  <div className="text-slate-400">Status: {log.status}</div>
                  {log.imageUrl && (
                    <a href={log.imageUrl} target="_blank" rel="noreferrer">
                      Preview image
                    </a>
                  )}
                  {log.error && <div className="text-rose-400">Error: {log.error}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="button-primary w-full"
          onClick={triggerGeneration}
          disabled={!productUrl || generationState.generating || isPending}
        >
          {generationState.generating || isPending ? "Generating article…" : "Generate review article"}
        </button>

        <ProductInsightsCard
          data={scrapeState.data}
          loading={scrapeState.loading}
          error={scrapeState.error}
        />
      </div>

      <div className="space-y-6">
        {generationState.markdown ? (
          <MarkdownPreview markdown={generationState.markdown} />
        ) : (
          <div className="card text-sm text-slate-400">
            Generated article preview will appear here. Configure inputs, ingest product data, and
            launch the generator.
          </div>
        )}
        <SpellcheckPanel issues={generationState.spellIssues} />
      </div>
    </div>
  );
}
