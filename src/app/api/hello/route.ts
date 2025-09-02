import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This is a frontend API route that could communicate with backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // Example of how the frontend could communicate with backend
    // In a real scenario, you might make a request to the backend here
    const response = {
      message: 'Hello from Midora AI Frontend!',
      backend_url: backendUrl,
      timestamp: new Date().toISOString(),
      note: 'This frontend communicates with backend service for data operations'
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Example of processing data that would be sent to backend
    const response = {
      message: 'Data received by frontend',
      received_data: body,
      timestamp: new Date().toISOString(),
      note: 'In production, this data would be forwarded to backend service'
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to process POST request',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
