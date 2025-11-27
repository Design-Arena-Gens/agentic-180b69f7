"use client";

import type { SpellIssue } from "@/lib/spellcheck";

interface Props {
  issues: SpellIssue[];
}

export function SpellcheckPanel({ issues }: Props) {
  if (issues.length === 0) {
    return (
      <div className="card border-emerald-500/40 bg-emerald-950/10 text-sm text-emerald-200">
        No spelling concerns flagged.
      </div>
    );
  }

  return (
    <div className="card space-y-3 text-sm">
      <h2 className="text-lg font-semibold text-white">Spell check notes</h2>
      <ul className="space-y-2">
        {issues.map((issue, index) => (
          <li key={`${issue.word}-${index}`} className="rounded bg-slate-950/60 p-3">
            <div className="font-semibold text-rose-300">{issue.word}</div>
            {issue.suggestions.length > 0 ? (
              <div className="text-xs text-slate-400">
                Suggestions: {issue.suggestions.join(", ")}
              </div>
            ) : (
              <div className="text-xs text-slate-500">No suggestions available.</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
