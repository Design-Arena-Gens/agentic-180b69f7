"use client";

import { nanoid } from "nanoid";
import { useCallback } from "react";

export interface AffiliateLink {
  id: string;
  platform: string;
  url: string;
}

const PRESET_PLATFORMS = [
  "Amazon",
  "Mercado Livre",
  "Shopee",
  "Magalu",
  "Clickbank",
  "Hotmart",
  "Eduzz",
  "Kiwify",
  "Braip"
];

interface Props {
  value: AffiliateLink[];
  onChange: (links: AffiliateLink[]) => void;
}

export function AffiliateLinksInput({ value, onChange }: Props) {
  const updateLink = useCallback(
    (id: string, field: "platform" | "url", next: string) => {
      onChange(
        value.map((link) =>
          link.id === id
            ? {
                ...link,
                [field]: next
              }
            : link
        )
      );
    },
    [value, onChange]
  );

  const addLink = useCallback(() => {
    onChange([
      ...value,
      {
        id: nanoid(),
        platform: "",
        url: ""
      }
    ]);
  }, [value, onChange]);

  const removeLink = useCallback(
    (id: string) => {
      onChange(value.filter((link) => link.id !== id));
    },
    [value, onChange]
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_PLATFORMS.map((platform) => (
          <button
            key={platform}
            type="button"
            className="badge"
            onClick={() =>
              onChange([
                ...value,
                {
                  id: nanoid(),
                  platform,
                  url: ""
                }
              ])
            }
          >
            {platform}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {value.map((link) => (
          <div key={link.id} className="grid gap-3 rounded-lg border border-slate-800 p-4">
            <div>
              <label className="label">Platform</label>
              <input
                className="input"
                value={link.platform}
                placeholder="e.g. Amazon"
                onChange={(event) => updateLink(link.id, "platform", event.target.value)}
              />
            </div>
            <div>
              <label className="label">Affiliate URL</label>
              <input
                className="input"
                value={link.url}
                placeholder="https://..."
                onChange={(event) => updateLink(link.id, "url", event.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-rose-400 hover:text-rose-300"
                onClick={() => removeLink(link.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="button-primary" onClick={addLink}>
        + Add affiliate link
      </button>
    </div>
  );
}
