"use client";

import { motion } from "framer-motion";
import {
  Coins,
  Bot,
  Lock,
  Layers,
  Award,
  Cpu,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Coins,
    title: "Yield-Bearing Positions",
    description:
      "Capital earns 4-5% APY via Aave while locked in markets. Winners get principal + winnings + 90% of yield. First in class.",
    badge: "DeFi Native",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    icon: Bot,
    title: "Automated AI Oracle",
    description:
      "SHA256-digested HF snapshots, LLM parsing, cryptographic proof, instant settlement. No human voting, no bias, no delay.",
    badge: "Trustless",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Lock,
    title: "ZK-Privacy for Institutions",
    description:
      "zk-SNARK encrypted position sizes for hedge funds. Prevents front-running. Unlocks institutional liquidity Polymarket can not touch.",
    badge: "Enterprise",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
  {
    icon: Layers,
    title: "Dual-Currency Compliance",
    description:
      "Gold Coins (entertainment), Sweeps Coins (promotional), Pro Mode (USDC/BTC/ETH/SOL). One shared quote engine.",
    badge: "Compliant",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Award,
    title: "Soulbound Reputation",
    description:
      "Non-transferable SBTs track forecasting calibration. High-rep users get lower fees, higher limits, and DAO governance weight.",
    badge: "Web3",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    icon: Cpu,
    title: "IoT Oracle Markets",
    description:
      "GPU utilization, datacenter telemetry, hardware deployment — physical-world AI markets via TEE-signed IoT feeds.",
    badge: "Unique",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />
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
            BUILT DIFFERENT
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4 text-balance">
            Everything prediction
            <br />
            markets <span className="text-gradient">should be.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Three layers no competitor combines: yield-bearing positions,
            automated AI resolution, and institutional ZK-privacy.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="group h-full transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${feature.bgColor} ${feature.borderColor} border`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{feature.title}</h3>
                        <Badge variant="secondary" className="text-[10px]">
                          {feature.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {[
            { label: "waitlist signups", value: "5" },
            { label: "TVL preview", value: "$2.41M" },
            { label: "repo files", value: "224" },
            { label: "curated TFIs", value: "8" },
            { label: "APY via Aave", value: "4.7%" },
            { label: "chains deployed", value: "3" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/30 p-4 text-center"
            >
              <span className="text-2xl font-bold text-primary font-mono">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
