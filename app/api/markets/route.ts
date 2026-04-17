import { NextResponse } from "next/server";

export interface Market {
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
  {
    id: "HF-MODEL-007",
    title: "DeepMind releases Gemini 3.0 with 10M context",
    category: "Release",
    probability: 51,
    change24h: 7.8,
    volume: "$201,300",
    liquidity: "$167,400",
    participants: 612,
    deadline: "Dec 31, 2026",
    status: "active",
    trending: true,
  },
  {
    id: "HF-BENCH-008",
    title: "Open-source model tops GPT-4 on Arena ELO",
    category: "Benchmark",
    probability: 29,
    change24h: -4.2,
    volume: "$445,200",
    liquidity: "$312,800",
    participants: 1847,
    deadline: "Jun 30, 2026",
    status: "active",
    trending: false,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const trending = searchParams.get("trending");

  let filteredMarkets = markets;

  if (category && category !== "All") {
    filteredMarkets = filteredMarkets.filter((m) => m.category === category);
  }

  if (status) {
    filteredMarkets = filteredMarkets.filter((m) => m.status === status);
  }

  if (trending === "true") {
    filteredMarkets = filteredMarkets.filter((m) => m.trending);
  }

  return NextResponse.json({
    markets: filteredMarkets,
    total: filteredMarkets.length,
    timestamp: new Date().toISOString(),
  });
}
