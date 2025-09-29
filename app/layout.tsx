import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import { LoanFormProvider } from "@/contexts/LoanFormContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trademart.app'),
  title: {
    default: "TradeMart - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide",
    template: "%s | TradeMart - Global B2B Marketplace"
  },
  description: "TradeMart is the leading global B2B marketplace connecting verified suppliers with buyers worldwide. Find products, submit RFQs, secure payments, and grow your business with 10K+ suppliers across 100+ countries.",
  keywords: [
    "B2B marketplace",
    "global trade",
    "suppliers",
    "buyers",
    "RFQ",
    "business commerce",
    "manufacturing",
    "wholesale",
    "international trade",
    "trade platform",
    "B2B sourcing",
    "supply chain",
    "trade marketplace",
    "business network",
    "trade partners",
    "global suppliers",
    "trade security",
    "escrow payments",
    "trade verification",
    "business growth"
  ],
  authors: [{ name: "TradeMart Team", url: "https://trademart.app" }],
  creator: "TradeMart",
  publisher: "TradeMart",
  applicationName: "TradeMart",
  category: "Business",
  classification: "B2B Marketplace",
  referrer: "origin-when-cross-origin",
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1d4ed8" }
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://trademart.app",
    languages: {
      "en-US": "https://trademart.app",
      "en-GB": "https://trademart.app",
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/api/favicon', sizes: 'any' },
      { url: '/favicon-32.png?v=4', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png?v=4', type: 'image/png', sizes: '16x16' },
      { url: '/logofinal.png?v=4', type: 'image/png', sizes: '48x48' },
      { url: '/logofinal.png?v=4', type: 'image/png', sizes: '64x64' },
    ],
    shortcut: '/api/favicon',
    apple: [
      { url: '/logofinal.png?v=4', sizes: '180x180' },
      { url: '/logofinal.png?v=4', sizes: '152x152' },
      { url: '/logofinal.png?v=4', sizes: '120x120' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logofinal.png?v=4',
        color: '#2563eb',
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trademart.app',
    siteName: 'TradeMart',
    title: 'TradeMart - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide',
    description: 'TradeMart is the leading global B2B marketplace connecting verified suppliers with buyers worldwide. Find products, submit RFQs, secure payments, and grow your business with 10K+ suppliers across 100+ countries.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TradeMart - Global B2B Marketplace',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@trademart',
    creator: '@trademart',
    title: 'TradeMart - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide',
    description: 'TradeMart is the leading global B2B marketplace connecting verified suppliers with buyers worldwide. Find products, submit RFQs, secure payments, and grow your business.',
    images: ['/twitter-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/api/favicon" />
        <link rel="shortcut icon" href="/api/favicon" />
        <link rel="apple-touch-icon" href="/logofinal.png?v=4" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=4" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png?v=4" />
        <link rel="icon" type="image/png" sizes="48x48" href="/logofinal.png?v=4" />
        <link rel="icon" type="image/png" sizes="64x64" href="/logofinal.png?v=4" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <LoanFormProvider>
            {children}
          </LoanFormProvider>
        </Providers>
        <WhatsAppButton />
      </body>
    </html>
  );
}
