import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  themeColor: "#0B5FFF",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kitogo.health"),
  title: "KITOGO — Clinical-grade AI for patient triage and intake",
  description:
    "KITOGO's AI agent handles patient intake, symptom assessment, and routing across phone, web, and SMS — 24/7. HIPAA-compliant, SOC 2 Type II certified, integrates with Epic, Cerner, athenahealth and more.",
  keywords: [
    "patient triage",
    "AI healthcare",
    "clinical intake",
    "HIPAA AI",
    "healthcare automation",
    "ESI triage",
    "Epic integration",
    "patient routing",
    "healthcare AI agent",
  ],
  authors: [{ name: "KITOGO Health, Inc." }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://kitogo.health/",
    title: "KITOGO — Triage every patient in under 60 seconds",
    description:
      "The clinical-grade AI agent for patient triage and intake. Now triaging 2.5M+ patient calls monthly across 14 healthcare networks.",
    images: [{ url: "https://kitogo.health/og-image.png", width: 1200, height: 630 }],
    siteName: "KITOGO",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kitogohealth",
    title: "KITOGO — Triage every patient in under 60 seconds",
    description:
      "Clinical-grade AI for patient triage. HIPAA-compliant. Integrates with Epic, Cerner, athenahealth.",
    images: ["https://kitogo.health/twitter-card.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230B5FFF'/%3E%3Ctext x='16' y='22' font-family='Inter,sans-serif' font-size='18' font-weight='800' text-anchor='middle' fill='white'%3EK%3C/text%3E%3C/svg%3E" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://kitogo.health/#organization",
                  name: "KITOGO Health, Inc.",
                  url: "https://kitogo.health/",
                  logo: "https://kitogo.health/logo.png",
                  sameAs: [
                    "https://twitter.com/kitogohealth",
                    "https://www.linkedin.com/company/kitogo",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "Sales",
                    email: "sales@kitogo.health",
                  },
                },
                {
                  "@type": "SoftwareApplication",
                  name: "KITOGO",
                  applicationCategory: "HealthApplication",
                  operatingSystem: "Web, iOS, Android",
                  offers: {
                    "@type": "AggregateOffer",
                    priceCurrency: "USD",
                    lowPrice: "1500",
                    highPrice: "12000",
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: "4.9",
                    reviewCount: "47",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
