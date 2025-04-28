import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('Congrats you have created an ngrok web server', {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
