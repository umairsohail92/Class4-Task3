import { ExternalLink, Info, CheckCircle } from "lucide-react";
import { GroundingSource } from "../types";

interface SourcesPanelProps {
  sources: GroundingSource[];
  isLive: boolean;
}

export default function SourcesPanel({ sources, isLive }: SourcesPanelProps) {
  if (!sources || sources.length === 0) return null;

  // Deduplicate sources by URL to keep listing neat and pristine
  const uniqueSources = sources.filter(
    (src, index, self) => self.findIndex((s) => s.url === src.url) === index
  );

  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 md:p-6 space-y-4">
      <div className="flex items-start space-x-3">
        <div className="bg-emerald-150 p-1.5 rounded-lg text-emerald-800 shrink-0">
          <Info className="w-4.5 h-4.5" />
        </div>
        <div>
          <h3 className="text-sm font-sans font-bold text-zinc-900 flex items-center gap-1.5">
            Verified Crawl Sources
            {isLive && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                Live Grounded
              </span>
            )}
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            The discount offers below were fetched and consolidated from these web pages, leaflets, and seasonal bank announcements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {uniqueSources.map((source, index) => (
          <a
            key={index}
            href={source.url}
            target="_blank"
            referrerPolicy="no-referrer"
            className="flex items-center justify-between p-3 bg-white hover:bg-zinc-50 border border-zinc-150 rounded-xl hover:border-emerald-500 hover:shadow-xs transition-all group cursor-pointer text-left"
          >
            <div className="space-y-1 pr-2 truncate">
              <span className="block text-xs font-semibold text-zinc-800 group-hover:text-emerald-700 truncate">
                {source.title || "Retail Promotion Document"}
              </span>
              <span className="block text-[10px] text-zinc-400 truncate">
                {source.url}
              </span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 shrink-0 select-none" />
          </a>
        ))}
      </div>
    </div>
  );
}
