import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Join TradeMart - Create Your B2B Account | Global Marketplace",
    description: "Join TradeMart, the leading global B2B marketplace. Create your buyer or supplier account and connect with 10K+ verified businesses worldwide. Secure trading platform with escrow payments.",
    keywords: [
        "join trademart",
        "B2B account",
        "business registration",
        "supplier account",
        "buyer account",
        "global marketplace",
        "trade platform",
        "business network",
        "supplier registration",
        "buyer registration",
        "B2B signup",
        "trade account",
        "business platform"
    ],
    openGraph: {
        title: "Join TradeMart - Create Your B2B Account | Global Marketplace",
        description: "Join TradeMart, the leading global B2B marketplace. Create your buyer or supplier account and connect with 10K+ verified businesses worldwide.",
        url: "https://trademart.app/auth/signup",
        siteName: "TradeMart",
        images: [
            {
                url: "/og-signup.png",
                width: 1200,
                height: 630,
                alt: "Join TradeMart - B2B Marketplace",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Join TradeMart - Create Your B2B Account | Global Marketplace",
        description: "Join TradeMart, the leading global B2B marketplace. Create your buyer or supplier account and connect with verified businesses worldwide.",
        images: ["/twitter-signup.png"],
    },
    alternates: {
        canonical: "https://trademart.app/auth/signup",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
