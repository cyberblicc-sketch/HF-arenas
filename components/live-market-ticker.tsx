"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const liveMarkets = [
  {
    id: "HF-BENCH-001",
    title: "Llama 4 top 5 on LMSYS",
    probability: 63,
    outcome: "YES",
    volume: "$124K",
    trending: true,
  },
  {
    id: "HF-DL-002",
    title: "Qwen3 reaches 1M downloads",
    probability: 71,
    outcome: "YES",
    volume: "$89K",
    trending: false,
  },
  {
    id: "HF-MODEL-003",
    title: "GPT-5 release before July",
    probability: 42,
    outcome: "YES",
    volume: "$312K",
    trending: true,
  },
  {
    id: "HF-BENCH-004",
    title: "Claude beats GPT-4 on MMLU",
    probability: 58,
    outcome: "YES",
    volume: "$67K",
    trending: false,
  },
];

export function LiveMarketTicker() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-1">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-3 px-2">
        {liveMarkets.map((market, index) => (
          <motion.div
            key={market.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group flex-shrink-0"
          >
            <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 transition-all hover:border-primary/50 hover:bg-card/80 cursor-pointer min-w-[280px]">
              {/* Market ID */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                    {market.id}
                  </Badge>
                  {market.trending && (
                    <TrendingUp className="h-3 w-3 text-success" />
                  )}
                </div>
                <span className="text-sm font-medium line-clamp-1 max-w-[160px]">
                  {market.title}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Vol: {market.volume}</span>
                </div>
              </div>

              {/* Probability */}
              <div className="ml-auto flex flex-col items-end gap-1">
                <div
                  className={`text-xl font-bold font-mono ${
                    market.probability >= 60
                      ? "text-success"
                      : market.probability <= 40
                      ? "text-destructive"
                      : "text-foreground"
                  }`}
                >
                  {market.probability}%
                </div>
                <Badge
                  variant={market.probability >= 50 ? "success" : "warning"}
                  className="text-[10px]"
                >
                  {market.outcome}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gradient fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-card/50 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card/50 to-transparent" />
    </div>
  );
}
