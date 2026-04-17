"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LiveMarketTicker } from "@/components/live-market-ticker";

interface HeroProps {
  onWaitlistClick: () => void;
  waitlistCount: number;
}

export function Hero({ onWaitlistClick, waitlistCount }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-16">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient orb */}
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Pre-launch badge */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="live" className="gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Pre-launch
              </Badge>
              <Badge variant="muted">AI Forecasting Protocol</Badge>
              <Badge variant="outline">{waitlistCount} on waitlist</Badge>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-balance">
              The market{" "}
              <span className="text-gradient">layer</span>
              <br />
              for forecasting
              <br />
              <span className="text-gradient">AI progress.</span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
              Prediction markets tied to verifiable AI outcomes — benchmark wins,
              leaderboard shifts, model releases, dataset adoption. Yield-bearing.
              Compliance-aware. Automated resolution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button onClick={onWaitlistClick} size="xl" variant="glow">
                Join Waitlist
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl">
                View Markets
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
              <span className="font-semibold text-foreground">{waitlistCount} forecasters</span>
              <span>already on the list</span>
              <span className="text-border">·</span>
              <span>No purchase necessary</span>
              <span className="text-border">·</span>
              <span>Free Sweeps entry</span>
            </div>
          </motion.div>

          {/* Right Column - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Yield APY Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Zap className="h-4 w-4 text-accent" />
                Yield APY
              </div>
              <div className="text-3xl font-bold text-accent font-mono">
                <AnimatedCounter value={4.7} suffix="%" decimals={1} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Via Aave/Compound</div>
            </div>

            {/* TVL Preview Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-success/50 hover:shadow-lg hover:shadow-success/5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Shield className="h-4 w-4 text-success" />
                TVL Preview
              </div>
              <div className="text-3xl font-bold text-success font-mono">
                $<AnimatedCounter value={2.41} suffix="M" decimals={2} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Pre-launch commitments</div>
            </div>

            {/* Launch TFIs Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Launch TFIs
              </div>
              <div className="text-3xl font-bold text-primary font-mono">
                <AnimatedCounter value={8} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Technical Forecasting Instruments</div>
            </div>

            {/* Chains Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-foreground/20 hover:shadow-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <div className="h-4 w-4 rounded-full bg-gradient-to-r from-primary to-accent" />
                Chains
              </div>
              <div className="text-3xl font-bold font-mono">
                <AnimatedCounter value={3} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Base, Arbitrum, Optimism</div>
            </div>
          </motion.div>
        </div>

        {/* Live Market Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <LiveMarketTicker />
        </motion.div>
      </div>
    </section>
  );
}
