import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/admin/',
                '/dashboard/',
                '/_next/',
                '/auth/signin',
                '/auth/signup',
            ],
        },
        sitemap: 'https://trademart.app/sitemap.xml',
    }
}
