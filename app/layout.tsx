import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trademart.com'),
  title: "TradeMart - Global B2B Marketplace",
  description: "Connect buyers and suppliers worldwide. Find products, submit RFQs, and grow your business on TradeMart.",
  keywords: "B2B marketplace, global trade, suppliers, buyers, RFQ, business, commerce, manufacturing, wholesale",
  authors: [{ name: "TradeMart Team" }],
  creator: "TradeMart",
  publisher: "TradeMart",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logofinal.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logofinal.png',
  },
  openGraph: {
    title: "TradeMart - Global B2B Marketplace",
    description: "Connect buyers and suppliers worldwide. Find products, submit RFQs, and grow your business on TradeMart.",
    url: "https://trademart.com",
    siteName: "TradeMart",
    images: [
      {
        url: '/logofinal.png',
        width: 1200,
        height: 630,
        alt: 'TradeMart Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "TradeMart - Global B2B Marketplace",
    description: "Connect buyers and suppliers worldwide. Find products, submit RFQs, and grow your business on TradeMart.",
    images: ['/logofinal.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
