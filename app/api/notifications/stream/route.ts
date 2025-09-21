import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { notificationService, SSEResponse } from '@/lib/notifications';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Create SSE response
        const headers = new Headers({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control',
        });

        const stream = new ReadableStream({
            start(controller) {
                // Send initial connection message
                const initialMessage = `data: ${JSON.stringify({
                    type: 'connected',
                    message: 'Connected to notifications stream',
                    timestamp: new Date().toISOString()
                })}\n\n`;

                controller.enqueue(new TextEncoder().encode(initialMessage));

                // Create a mock Response object for the notification service
                const mockResponse = {
                    write: (data: string) => {
                        try {
                            controller.enqueue(new TextEncoder().encode(data));
                        } catch (error) {
                            console.error('Error writing to SSE stream:', error);
                        }
                    },
                    on: (event: string, _callback: () => void) => {
                        // Handle connection close
                        if (event === 'close') {
                            // Clean up when connection closes
                            setTimeout(() => {
                                try {
                                    controller.close();
                                } catch (error) {
                                    console.error('Error closing SSE stream:', error);
                                }
                            }, 100);
                        }
                    }
                } as Record<string, unknown>;

                // Add client to notification service
                // notificationService.addClient(session.user.id, mockResponse as unknown as SSEResponse);

                // Send periodic heartbeat to keep connection alive
                const heartbeatInterval = setInterval(() => {
                    try {
                        const heartbeat = `data: ${JSON.stringify({
                            type: 'heartbeat',
                            timestamp: new Date().toISOString()
                        })}\n\n`;
                        controller.enqueue(new TextEncoder().encode(heartbeat));
                    } catch (error) {
                        console.error('Error sending heartbeat:', error);
                        clearInterval(heartbeatInterval);
                    }
                }, 30000); // Send heartbeat every 30 seconds

                // Clean up on close
                const cleanup = () => {
                    clearInterval(heartbeatInterval);
                    // notificationService.removeClient(session.user.id, mockResponse as unknown as SSEResponse);
                };

                // Handle client disconnect
                request.signal?.addEventListener('abort', cleanup);
            }
        });

        return new Response(stream, { headers });
    } catch (error) {
        console.error('SSE connection error:', error);
        return NextResponse.json({ error: 'Failed to establish connection' }, { status: 500 });
    }
}
