import { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "TradeMart - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide",
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
  openGraph: {
    title: "TradeMart - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide",
    description: "TradeMart is the leading global B2B marketplace connecting verified suppliers with buyers worldwide. Find products, submit RFQs, secure payments, and grow your business with 10K+ suppliers across 100+ countries.",
    url: "https://trademart.app",
    siteName: "TradeMart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TradeMart - Global B2B Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeMart - Global B2B Marketplace | Connect Buyers & Suppliers Worldwide",
    description: "TradeMart is the leading global B2B marketplace connecting verified suppliers with buyers worldwide. Find products, submit RFQs, secure payments, and grow your business.",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "https://trademart.app",
  },
};

export default function Home() {
  return <HomeClient />;
}