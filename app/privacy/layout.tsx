import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy - TradeMart B2B Marketplace",
    description: "Read TradeMart's Privacy Policy. Learn how we protect your data, handle information, and ensure privacy on our global B2B marketplace platform.",
    keywords: [
        "privacy policy",
        "trademart privacy",
        "data protection",
        "B2B privacy",
        "trade platform privacy",
        "user privacy",
        "data security",
        "information handling",
        "privacy rights",
        "data collection"
    ],
    openGraph: {
        title: "Privacy Policy - TradeMart B2B Marketplace",
        description: "Read TradeMart's Privacy Policy. Learn how we protect your data, handle information, and ensure privacy on our global B2B marketplace platform.",
        url: "https://trademart.app/privacy",
        siteName: "TradeMart",
        images: [
            {
                url: "/og-privacy.png",
                width: 1200,
                height: 630,
                alt: "TradeMart Privacy Policy",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Privacy Policy - TradeMart B2B Marketplace",
        description: "Read TradeMart's Privacy Policy. Learn how we protect your data, handle information, and ensure privacy on our global B2B marketplace platform.",
        images: ["/twitter-privacy.png"],
    },
    alternates: {
        canonical: "https://trademart.app/privacy",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function PrivacyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
