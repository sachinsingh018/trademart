import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service - TradeMart B2B Marketplace",
    description: "Read TradeMart's Terms of Service. Learn about our B2B marketplace policies, user responsibilities, payment terms, and dispute resolution for global trade platform.",
    keywords: [
        "terms of service",
        "trademart terms",
        "B2B marketplace terms",
        "trade platform terms",
        "user agreement",
        "service terms",
        "trading terms",
        "business terms",
        "marketplace agreement",
        "trade policies"
    ],
    openGraph: {
        title: "Terms of Service - TradeMart B2B Marketplace",
        description: "Read TradeMart's Terms of Service. Learn about our B2B marketplace policies, user responsibilities, payment terms, and dispute resolution.",
        url: "https://trademart.app/terms",
        siteName: "TradeMart",
        images: [
            {
                url: "/og-terms.png",
                width: 1200,
                height: 630,
                alt: "TradeMart Terms of Service",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Terms of Service - TradeMart B2B Marketplace",
        description: "Read TradeMart's Terms of Service. Learn about our B2B marketplace policies, user responsibilities, payment terms, and dispute resolution.",
        images: ["/twitter-terms.png"],
    },
    alternates: {
        canonical: "https://trademart.app/terms",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
