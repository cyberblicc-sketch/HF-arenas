"use client";

import { motion } from "framer-motion";
import {
  Search,
  Wallet,
  Bot,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Choose a Technical Forecasting Instrument",
    description:
      "Browse markets on AI benchmarks, model rankings, download thresholds, and dataset adoption. Every TFI is backed by a deterministic, publicly verifiable data source.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    number: "02",
    icon: Wallet,
    title: "Your capital earns while you wait",
    description:
      "Staked USDC routes through YieldVault to Aave/Compound, earning 4-5% APY. Your money never sits idle — regardless of market outcome.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    number: "03",
    icon: Bot,
    title: "AI agent resolves automatically",
    description:
      "Our oracle agent monitors HF API, digests data with SHA256, parses with LLMs, and submits cryptographic proofs on-chain. Settlement in seconds, not days.",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Winners receive principal + winnings + yield",
    description:
      "90% of accrued yield goes to winners. 10% funds the protocol treasury. Your upside compounds on top of what you'd earn from simply holding.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute top-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            THE MECHANISM
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4 text-balance">
            How HuggyDual <span className="text-gradient">works.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                    {/* Step Number & Icon */}
                    <div className="flex items-center gap-4 sm:flex-col sm:items-center">
                      <span className="text-4xl font-bold text-muted-foreground/30 font-mono">
                        {step.number}
                      </span>
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.bgColor} border border-border`}
                      >
                        <step.icon className={`h-7 w-7 ${step.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow (desktop) */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:flex items-center justify-center">
                        <ChevronRight className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                </CardContent>

                {/* Progress indicator */}
                <div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent transition-all duration-500 group-hover:w-full"
                  style={{ width: `${((index + 1) / steps.length) * 100}%` }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
