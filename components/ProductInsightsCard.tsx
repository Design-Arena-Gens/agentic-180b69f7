"use client";

import { ProductScrapeResult } from "@/lib/productScraper";
import { useState } from "react";

interface Props {
  data?: ProductScrapeResult;
  loading: boolean;
  error?: string;
}

export function ProductInsightsCard({ data, loading, error }: Props) {
  const [expanded, setExpanded] = useState(false);

  if (loading) {
    return (
      <div className="card">
        <p className="text-sm text-slate-400">Scraping product intelligence…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-rose-500/40 bg-rose-950/20">
        <p className="text-sm text-rose-300">Failed to scrape: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card">
        <p className="text-sm text-slate-400">
          Provide a product URL to ingest details (title, features, specs, breadcrumbs, pricing).
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white">Product intelligence</h2>
        <p className="text-sm text-slate-400">
          Parsed heuristically from the destination page. Review and adjust before generating.
        </p>
      </div>
      <dl className="grid gap-3 text-sm">
        {data.title && (
          <div>
            <dt className="label">Title</dt>
            <dd>{data.title}</dd>
          </div>
        )}
        {data.description && (
          <div>
            <dt className="label">Description</dt>
            <dd>{data.description}</dd>
          </div>
        )}
        {data.price && (
          <div>
            <dt className="label">Price</dt>
            <dd>{data.price}</dd>
          </div>
        )}
        {data.breadcrumbs && (
          <div>
            <dt className="label">Breadcrumbs</dt>
            <dd>{data.breadcrumbs.join(" › ")}</dd>
          </div>
        )}
      </dl>
      {data.features && data.features.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <span className="label">Key features</span>
            <button
              type="button"
              className="text-xs text-emerald-400"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Collapse" : "Expand"}
            </button>
          </div>
          <ul className={`mt-2 space-y-2 text-sm ${expanded ? "" : "line-clamp-4"}`}>
            {data.features.map((feature, index) => (
              <li key={index} className="rounded bg-slate-900/80 p-2">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
      {data.technical && (
        <div>
          <span className="label">Technical specs</span>
          <div className="mt-2 max-h-60 overflow-y-auto rounded border border-slate-800/80 bg-slate-950/60 p-3 text-xs">
            <table className="w-full border-separate border-spacing-y-2">
              <tbody>
                {Object.entries(data.technical).map(([key, value]) => (
                  <tr key={key}>
                    <td className="pr-3 font-medium text-slate-300">{key}</td>
                    <td className="text-slate-400">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
