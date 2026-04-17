"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Eye,
  FileCheck,
  Globe,
  Server,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const complianceFeatures = [
  {
    icon: Shield,
    title: "Sanctions Screening",
    description:
      "Real-time TRM Labs / Chainalysis API integration. Fail-closed: any API error blocks the transaction.",
    status: "active",
  },
  {
    icon: Lock,
    title: "ZK-Privacy Layer",
    description:
      "zk-SNARK encrypted position sizes for institutional users. Prevents front-running while maintaining compliance.",
    status: "active",
  },
  {
    icon: Eye,
    title: "KYC Pipeline",
    description:
      "Delegated to relayer SanctionsGuard before EIP-712 signature issuance. SumSub integration ready.",
    status: "active",
  },
  {
    icon: FileCheck,
    title: "On-Chain Blocking",
    description:
      "ArenaRegistry.setSanctionStatus allows operator to block specific addresses from placing bets.",
    status: "active",
  },
  {
    icon: Globe,
    title: "Geo-Fencing",
    description:
      "Regional restrictions enforced at relayer level with IP geolocation and VPN detection.",
    status: "planned",
  },
  {
    icon: Server,
    title: "Audit Trail",
    description:
      "Complete transaction logging, penetration test results, and Trust Center with audit logs.",
    status: "active",
  },
];

const certifications = [
  { name: "PCI DSS", status: "compliant" },
  { name: "GDPR", status: "compliant" },
  { name: "SOC 2", status: "in-progress" },
  { name: "CCPA", status: "compliant" },
];

const dualCurrencyModes = [
  {
    mode: "Gold Coins",
    type: "Entertainment",
    description: "Non-redeemable play currency for entertainment purposes only.",
    features: ["No real-money value", "Practice markets", "Tutorial mode"],
  },
  {
    mode: "Sweeps Coins",
    type: "Promotional",
    description: "Promotional currency with legal redemption pathways.",
    features: ["Legal redemption", "Prize markets", "No purchase required"],
  },
  {
    mode: "Pro Mode",
    type: "Crypto Native",
    description: "Full DeFi integration with real digital assets.",
    features: ["USDC/BTC/ETH/SOL", "Yield-bearing", "Institutional access"],
  },
];

export function Compliance() {
  return (
    <section id="compliance" className="py-24 relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-success/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4">
            COMPLIANCE FIRST
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4 text-balance">
            Built for regulatory
            <br />
            <span className="text-gradient">clarity.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Comprehensive compliance architecture addressing legal and
            jurisdictional boundaries from day one.
          </p>
        </motion.div>

        {/* Compliance Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          {complianceFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full transition-all duration-300 hover:border-success/30 hover:shadow-lg hover:shadow-success/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 border border-success/20">
                      <feature.icon className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm">{feature.title}</h3>
                        <Badge
                          variant={
                            feature.status === "active" ? "success" : "warning"
                          }
                          className="text-[10px]"
                        >
                          {feature.status === "active" ? (
                            <>
                              <CheckCircle className="h-2.5 w-2.5" />
                              Active
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-2.5 w-2.5" />
                              Planned
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="border-success/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-success" />
                Certifications & Compliance Standards
              </h3>
              <div className="flex flex-wrap gap-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.name}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2"
                  >
                    <span className="font-medium">{cert.name}</span>
                    <Badge
                      variant={
                        cert.status === "compliant" ? "success" : "warning"
                      }
                      className="text-[10px]"
                    >
                      {cert.status === "compliant" ? "Compliant" : "In Progress"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dual-Currency Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Dual-Currency Compliance</h3>
            <p className="text-muted-foreground">
              One shared quote engine. Mode switching never changes probabilities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {dualCurrencyModes.map((mode, index) => (
              <motion.div
                key={mode.mode}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full transition-all duration-300 hover:border-primary/30">
                  <CardContent className="p-6">
                    <Badge
                      variant={
                        mode.type === "Entertainment"
                          ? "secondary"
                          : mode.type === "Promotional"
                          ? "warning"
                          : "success"
                      }
                      className="mb-4"
                    >
                      {mode.type}
                    </Badge>
                    <h4 className="text-xl font-bold mb-2">{mode.mode}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {mode.description}
                    </p>
                    <ul className="space-y-2">
                      {mode.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
