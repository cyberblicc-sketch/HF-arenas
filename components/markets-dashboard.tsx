"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  BarChart3,
  Filter,
  Search,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Market {
  id: string;
  title: string;
  category: string;
  probability: number;
  change24h: number;
  volume: string;
  liquidity: string;
  participants: number;
  deadline: string;
  status: "active" | "resolving" | "closed";
  trending: boolean;
}

const markets: Market[] = [
  {
    id: "HF-BENCH-001",
    title: "Llama 4 reaches top 5 on LMSYS Chatbot Arena",
    category: "Benchmark",
    probability: 63,
    change24h: 5.2,
    volume: "$124,500",
    liquidity: "$89,200",
    participants: 342,
    deadline: "Jun 30, 2026",
    status: "active",
    trending: true,
  },
  {
    id: "HF-DL-002",
    title: "Qwen3 reaches 1 million downloads on Hugging Face",
    category: "Downloads",
    probability: 71,
    change24h: -2.1,
    volume: "$89,300",
    liquidity: "$67,100",
    participants: 218,
    deadline: "May 15, 2026",
    status: "active",
    trending: false,
  },
  {
    id: "HF-MODEL-003",
    title: "OpenAI releases GPT-5 before July 2026",
    category: "Release",
    probability: 42,
    change24h: 12.4,
    volume: "$312,000",
    liquidity: "$245,600",
    participants: 1203,
    deadline: "Jul 1, 2026",
    status: "active",
    trending: true,
  },
  {
    id: "HF-BENCH-004",
    title: "Claude Opus 4.6 beats GPT-5 on MMLU benchmark",
    category: "Benchmark",
    probability: 58,
    change24h: 3.8,
    volume: "$67,200",
    liquidity: "$45,800",
    participants: 156,
    deadline: "Aug 31, 2026",
    status: "active",
    trending: false,
  },
  {
    id: "HF-DATA-005",
    title: "Open Instruct V2 becomes most downloaded dataset",
    category: "Dataset",
    probability: 34,
    change24h: -8.3,
    volume: "$23,100",
    liquidity: "$18,900",
    participants: 89,
    deadline: "Sep 15, 2026",
    status: "active",
    trending: false,
  },
  {
    id: "HF-BENCH-006",
    title: "Mistral Large 3 achieves 90%+ on HumanEval",
    category: "Benchmark",
    probability: 77,
    change24h: 1.2,
    volume: "$156,400",
    liquidity: "$123,200",
    participants: 487,
    deadline: "May 30, 2026",
    status: "resolving",
    trending: true,
  },
];

const categories = ["All", "Benchmark", "Downloads", "Release", "Dataset"];

export function MarketsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"volume" | "probability" | "change">("volume");

  const filteredMarkets = markets.filter((market) => {
    const matchesCategory =
      selectedCategory === "All" || market.category === selectedCategory;
    const matchesSearch = market.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="markets" className="py-24 relative">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                LIVE MARKETS
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Technical Forecasting Instruments
              </h2>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
              View All Markets
            </Button>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="h-auto flex-wrap">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-sm">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Markets Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredMarkets.map((market, index) => (
              <motion.div
                key={market.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                      {/* Market Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-[10px] font-mono">
                            {market.id}
                          </Badge>
                          <Badge
                            variant={
                              market.status === "active"
                                ? "success"
                                : market.status === "resolving"
                                ? "warning"
                                : "secondary"
                            }
                            className="text-[10px]"
                          >
                            {market.status}
                          </Badge>
                          {market.trending && (
                            <Badge variant="muted" className="text-[10px] gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-2">
                          {market.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {market.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {market.participants} traders
                          </span>
                          <span className="flex items-center gap-1">
                            <BarChart3 className="h-3 w-3" />
                            Vol: {market.volume}
                          </span>
                        </div>
                      </div>

                      {/* Probability & Stats */}
                      <div className="flex items-center gap-6 lg:gap-8">
                        {/* 24h Change */}
                        <div className="hidden sm:flex flex-col items-center">
                          <span className="text-xs text-muted-foreground mb-1">
                            24h
                          </span>
                          <span
                            className={`flex items-center gap-1 text-sm font-semibold ${
                              market.change24h >= 0
                                ? "text-success"
                                : "text-destructive"
                            }`}
                          >
                            {market.change24h >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {market.change24h >= 0 ? "+" : ""}
                            {market.change24h}%
                          </span>
                        </div>

                        {/* Probability */}
                        <div className="flex flex-col items-center min-w-[100px]">
                          <div className="flex items-baseline gap-1 mb-2">
                            <span
                              className={`text-3xl font-bold font-mono ${
                                market.probability >= 60
                                  ? "text-success"
                                  : market.probability <= 40
                                  ? "text-destructive"
                                  : "text-foreground"
                              }`}
                            >
                              {market.probability}
                            </span>
                            <span className="text-lg text-muted-foreground">%</span>
                          </div>
                          <Progress
                            value={market.probability}
                            className="h-2 w-full"
                            indicatorClassName={
                              market.probability >= 60
                                ? "bg-success"
                                : market.probability <= 40
                                ? "bg-destructive"
                                : "bg-primary"
                            }
                          />
                          <span className="text-[10px] text-muted-foreground mt-1">
                            YES probability
                          </span>
                        </div>

                        {/* Action */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="hidden sm:flex"
                        >
                          Trade
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Load More Markets
          </Button>
        </div>
      </div>
    </section>
  );
}
