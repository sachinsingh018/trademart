import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        // Try to serve the logo as favicon
        const logoPath = path.join(process.cwd(), 'public', 'logofinal.png');
        const logoBuffer = fs.readFileSync(logoPath);

        return new NextResponse(logoBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=0, must-revalidate',
                'ETag': `"favicon-${Date.now()}"`,
            },
        });
    } catch (error) {
        // Fallback to a simple 16x16 favicon
        const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#2563eb"/><text x="16" y="20" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">TM</text></svg>`;

        return new NextResponse(fallbackSvg, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=0, must-revalidate',
                'ETag': `"favicon-fallback-${Date.now()}"`,
            },
        });
    }
}
