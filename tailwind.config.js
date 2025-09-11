/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // TradeMart brand colors
                primary: {
                    DEFAULT: '#0072CE',
                    foreground: '#ffffff',
                },
                secondary: {
                    DEFAULT: '#27AE60',
                    foreground: '#ffffff',
                },
                background: '#F4F6F8',
                foreground: '#2C3E50',
                card: {
                    DEFAULT: '#ffffff',
                    foreground: '#2C3E50',
                },
                muted: {
                    DEFAULT: '#f1f5f9',
                    foreground: '#64748b',
                },
                accent: {
                    DEFAULT: '#e2e8f0',
                    foreground: '#0f172a',
                },
                destructive: {
                    DEFAULT: '#ef4444',
                    foreground: '#ffffff',
                },
                border: '#e2e8f0',
                input: '#e2e8f0',
                ring: '#0072CE',
            },
            borderRadius: {
                lg: '0.5rem',
                md: '0.375rem',
                sm: '0.25rem',
            },
        },
    },
    plugins: [],
}
