import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "../styles/smooth-transitions.css";
import { Providers } from "./providers";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import { LoanFormProvider } from "@/contexts/LoanFormContext";
import { PopupProvider } from "@/contexts/PopupContext";
import NavbarWrapper from "@/components/ui/navbar-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tradepanda.ai'),
  title: {
    default: "TradePanda - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide",
    template: "%s | TradeMart - Global B2B Marketplace"
  },
  description: "TradePanda is the leading global B2B marketplace connecting verified suppliers with buyers worldwide. Find products, submit RFQs, secure payments, and grow your business with 10K+ suppliers across 100+ countries.",
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
  authors: [{ name: "TradePanda Team", url: "https://tradepanda.ai" }],
  creator: "TradePanda",
  publisher: "TradePanda",
  applicationName: "TradePanda",
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
    canonical: "https://tradepanda.ai",
    languages: {
      "en-US": "https://tradepanda.ai",
      "en-GB": "https://tradepanda.ai",
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
    url: 'https://tradepanda.ai',
    siteName: 'TradePanda',
    title: 'TradePanda - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide',
    description: 'TradePanda is the leading global B2B marketplace connecting verified suppliers with buyers worldwide. Find products, submit RFQs, secure payments, and grow your business with 10K+ suppliers across 100+ countries.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TradePanda - Global B2B Marketplace',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tradepanda',
    creator: '@tradepanda',
    title: 'TradePanda - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide',
    description: 'TradePanda is the leading global B2B marketplace connecting verified suppliers with buyers worldwide. Find products, submit RFQs, secure payments, and grow your business.',
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-04PLT61V9J"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-04PLT61V9J');
          `}
        </Script>

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
            <PopupProvider>
              <NavbarWrapper />
              {children}
            </PopupProvider>
          </LoanFormProvider>
        </Providers>
        <WhatsAppButton />
      </body>
    </html>
  );
}
