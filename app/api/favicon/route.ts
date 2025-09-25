import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    try {
        const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
        const faviconBuffer = fs.readFileSync(faviconPath);

        return new NextResponse(faviconBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/x-icon',
                'Cache-Control': 'public, max-age=0, must-revalidate',
                'ETag': `"favicon-${Date.now()}"`,
            },
        });
    } catch (error) {
        return new NextResponse('Favicon not found', { status: 404 });
    }
}
