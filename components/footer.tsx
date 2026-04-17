"use client";

import { motion } from "framer-motion";
import {
  Github,
  MessageCircle,
  FileText,
  ExternalLink,
  Mail,
} from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const footerLinks = {
  Protocol: [
    { label: "Markets", href: "#markets" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "API Docs", href: "#", external: true },
    { label: "Smart Contracts", href: "#", external: true },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Press Kit", href: "#" },
  ],
  Legal: [
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Compliance", href: "#compliance" },
    { label: "Risk Disclosure", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "GitHub", href: "#", external: true },
    { label: "Support", href: "#" },
    { label: "Bug Bounty", href: "#" },
  ],
};

const socialLinks = [
  { icon: XIcon, href: "#", label: "X (Twitter)" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: MessageCircle, href: "#", label: "Discord" },
  { icon: FileText, href: "#", label: "Docs" },
];

export function Footer({ onWaitlistClick }: { onWaitlistClick: () => void }) {
  return (
    <footer className="relative border-t border-border bg-card/30">
      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge variant="outline" className="mb-4">
              JOIN THE FUTURE
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-balance">
              Ready to forecast AI
              <br />
              <span className="text-gradient">progress?</span>
            </h2>
            <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8">
              Join the forecasters already on the waitlist.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="h-12 pl-11 w-full"
                />
              </div>
              <Button
                onClick={onWaitlistClick}
                size="lg"
                variant="glow"
                className="w-full sm:w-auto"
              >
                Get Early Access
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Links Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-base font-bold text-primary">H</span>
              </div>
              <span className="text-base font-bold">HuggyDual</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The market layer for forecasting AI progress. Yield-bearing.
              Compliance-aware.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary transition-colors hover:bg-secondary/80"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="h-3 w-3" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Pre-launch preview. No live markets. 18+ only. No purchase necessary.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {["Base", "Arbitrum", "Optimism"].map((chain) => (
              <Badge key={chain} variant="outline" className="text-xs">
                {chain}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
