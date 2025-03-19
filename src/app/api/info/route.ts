import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    name: 'AI笔记应用',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NEXT_PUBLIC_DEV === 'true' ? '开发环境' : '生产环境',
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(data);
} 