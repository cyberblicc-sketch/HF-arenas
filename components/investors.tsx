"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Rocket,
  Target,
  Users,
  Briefcase,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const investorBenefits = [
  {
    icon: Rocket,
    title: "Early Capital",
    description:
      "Accelerate productization, validation, and launch readiness with initial funding to enhance development and market entry.",
  },
  {
    icon: Users,
    title: "Strategic Introductions",
    description:
      "Connections to design partners, crypto ecosystems, and operator communities that align with our vision.",
  },
  {
    icon: Target,
    title: "Ecosystem Support",
    description:
      "Funding for open infrastructure projects, AI experimentation initiatives, and crypto-native community engagement.",
  },
  {
    icon: Briefcase,
    title: "Growth Partnership",
    description:
      "Meaningful partnerships for risk reduction during development phase and accelerated go-to-market.",
  },
];

const projectHighlights = [
  "Well-structured monorepo with relayer, indexer, smart contracts, and operational documentation",
  "Comprehensive static audit notes with meaningful fixes and remaining tasks identified",
  "Mature development phase with commitment to addressing vulnerabilities",
  "Clean API documentation for easy integration with forecasting features",
  "Simulation-first approach for safe testing before full-scale deployment",
];

export function Investors() {
  return (
    <section id="investors" className="py-24 relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />
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
            FOR INVESTORS
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4 text-balance">
            Building the future of
            <br />
            <span className="text-gradient">AI forecasting.</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            HF-Arenas combines cutting-edge technology with user-friendly design,
            enabling communities and researchers to transform complex data into
            actionable insights.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 mb-12"
        >
          {investorBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Project Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
                {/* Left: Project Status */}
                <div className="flex-1 mb-8 lg:mb-0">
                  <Badge variant="success" className="mb-4">
                    Proof of Seriousness
                  </Badge>
                  <h3 className="text-2xl font-bold mb-6">
                    Current Status and Progress
                  </h3>
                  <ul className="space-y-4">
                    {projectHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {highlight}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: CTA */}
                <div className="lg:w-80 p-6 rounded-xl border border-border bg-card/50">
                  <h4 className="font-semibold text-lg mb-2">
                    Interested in investing?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    Schedule a call to discuss partnership opportunities and learn
                    more about our roadmap.
                  </p>
                  <Button variant="glow" className="w-full">
                    Schedule a Call
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Or email us at investors@huggydual.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <blockquote className="text-2xl font-bold italic text-muted-foreground mb-4">
            &ldquo;Transforming uncertainty into usable intelligence&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground">- HF-Arenas Team</p>
        </motion.div>
      </div>
    </section>
  );
}
