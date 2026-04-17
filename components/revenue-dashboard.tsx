"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Activity,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Wallet,
  Shield,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const revenueMetrics = [
  {
    title: "Total Value Locked",
    value: 2410000,
    prefix: "$",
    suffix: "",
    change: 12.4,
    changeLabel: "vs last month",
    icon: DollarSign,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Protocol Revenue",
    value: 156400,
    prefix: "$",
    suffix: "",
    change: 8.2,
    changeLabel: "vs last month",
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Active Forecasters",
    value: 1847,
    prefix: "",
    suffix: "",
    change: 24.6,
    changeLabel: "vs last month",
    icon: Users,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Yield Distributed",
    value: 89200,
    prefix: "$",
    suffix: "",
    change: 15.3,
    changeLabel: "vs last month",
    icon: Wallet,
    color: "text-success",
    bgColor: "bg-success/10",
  },
];

const chainData = [
  { name: "Base", tvl: 1240000, percentage: 51.5, color: "bg-primary" },
  { name: "Arbitrum", tvl: 890000, percentage: 36.9, color: "bg-accent" },
  { name: "Optimism", tvl: 280000, percentage: 11.6, color: "bg-success" },
];

const recentActivity = [
  {
    type: "bet",
    user: "0x8f3a...4b2c",
    market: "HF-BENCH-001",
    amount: "$2,400",
    position: "YES",
    time: "2m ago",
  },
  {
    type: "resolution",
    market: "HF-MODEL-007",
    outcome: "YES",
    payout: "$34,200",
    time: "15m ago",
  },
  {
    type: "bet",
    user: "0x2d1e...9a8f",
    market: "HF-DL-002",
    amount: "$890",
    position: "NO",
    time: "23m ago",
  },
  {
    type: "yield",
    user: "0x5c4b...1d3e",
    amount: "$127.40",
    source: "Aave",
    time: "1h ago",
  },
];

export function RevenueDashboard() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-4">
            COMMAND CENTER
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-2">
            Global Revenue Dashboard
          </h2>
          <p className="text-muted-foreground">
            Real-time protocol metrics and performance indicators
          </p>
        </motion.div>

        {/* Main Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {revenueMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group relative overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.bgColor}`}
                    >
                      <metric.icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        metric.change >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {metric.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {metric.change}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold font-mono">
                      {metric.prefix}
                      <AnimatedCounter
                        value={metric.value}
                        decimals={0}
                      />
                      {metric.suffix}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.changeLabel}
                    </p>
                  </div>
                </CardContent>

                {/* Hover glow effect */}
                <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100">
                  <div
                    className={`absolute inset-0 ${metric.bgColor} blur-xl`}
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chain Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    TVL by Chain
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    3 chains
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {chainData.map((chain) => (
                  <div key={chain.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{chain.name}</span>
                      <span className="text-muted-foreground font-mono">
                        ${(chain.tvl / 1000000).toFixed(2)}M
                      </span>
                    </div>
                    <Progress
                      value={chain.percentage}
                      className="h-2"
                      indicatorClassName={chain.color}
                    />
                    <p className="text-xs text-muted-foreground">
                      {chain.percentage}% of total TVL
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Security & Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4 text-success" />
                    Security Status
                  </CardTitle>
                  <Badge variant="success" className="text-xs gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    All Clear
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Last Audit", value: "Static Analysis Complete", status: "success" },
                  { label: "Fraud Detection", value: "0 incidents (24h)", status: "success" },
                  { label: "Sanctions Screening", value: "TRM Labs Active", status: "success" },
                  { label: "Oracle Health", value: "99.97% uptime", status: "success" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}

                {/* Compliance Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {["PCI DSS", "GDPR", "SOC 2"].map((badge) => (
                    <Badge key={badge} variant="outline" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    Live Activity
                  </CardTitle>
                  <Badge variant="live" className="text-xs gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 py-2 border-b border-border last:border-0"
                  >
                    <div
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        activity.type === "bet"
                          ? "bg-primary/20"
                          : activity.type === "resolution"
                          ? "bg-success/20"
                          : "bg-accent/20"
                      }`}
                    >
                      {activity.type === "bet" ? (
                        <TrendingUp className="h-3 w-3 text-primary" />
                      ) : activity.type === "resolution" ? (
                        <Activity className="h-3 w-3 text-success" />
                      ) : (
                        <Wallet className="h-3 w-3 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        {activity.type === "bet" && (
                          <>
                            <span className="font-mono text-xs text-muted-foreground">
                              {activity.user}
                            </span>{" "}
                            bet{" "}
                            <span className="font-semibold">{activity.amount}</span>{" "}
                            <Badge
                              variant={
                                activity.position === "YES" ? "success" : "destructive"
                              }
                              className="text-[10px] ml-1"
                            >
                              {activity.position}
                            </Badge>
                          </>
                        )}
                        {activity.type === "resolution" && (
                          <>
                            <span className="font-mono text-xs">
                              {activity.market}
                            </span>{" "}
                            resolved{" "}
                            <Badge variant="success" className="text-[10px]">
                              {activity.outcome}
                            </Badge>{" "}
                            <span className="text-success font-semibold">
                              {activity.payout}
                            </span>
                          </>
                        )}
                        {activity.type === "yield" && (
                          <>
                            <span className="font-mono text-xs text-muted-foreground">
                              {activity.user}
                            </span>{" "}
                            earned{" "}
                            <span className="font-semibold text-accent">
                              {activity.amount}
                            </span>{" "}
                            yield via {activity.source}
                          </>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
