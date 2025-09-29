import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            fullName,
            email,
            phone,
            company,
            businessType,
            loanAmount,
            currency,
            loanPurpose,
            monthlyRevenue,
            businessAge,
            country,
            city,
            additionalInfo
        } = body;

        // Validate required fields
        if (!fullName || !email || !phone || !company) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Prepare data for Google Sheets
        const rowData = [
            new Date().toISOString(), // Timestamp
            fullName,
            email,
            phone,
            company,
            businessType || '',
            loanAmount || '',
            currency || 'USD',
            loanPurpose || '',
            monthlyRevenue || '',
            businessAge || '',
            country || '',
            city || '',
            additionalInfo || ''
        ];

        // Submit to Google Sheets
        const sheetsResponse = await submitToGoogleSheets(rowData);

        if (sheetsResponse.success) {
            return NextResponse.json({
                success: true,
                message: 'Loan application submitted successfully'
            });
        } else {
            return NextResponse.json(
                { success: false, error: 'Failed to submit to Google Sheets' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error processing loan application:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function submitToGoogleSheets(data: string[]) {
    try {
        const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

        if (!scriptUrl) {
            console.error('Google Apps Script URL not configured');
            return { success: false };
        }

        // Try GET first for testing, then POST
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data })
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            console.error('Non-JSON response from Google Apps Script:', textResponse);
            return { success: false, error: 'Invalid response from Google Sheets' };
        }

        const result = await response.json();
        return { success: response.ok, result };
    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
