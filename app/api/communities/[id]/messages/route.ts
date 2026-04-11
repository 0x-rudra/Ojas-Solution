import { NextResponse } from 'next/server';
import { sendMessage, getCommunityMessages, AppError } from '@/lib/community-services';
import { sendMessageSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: communityId } = await params;
    
    // Simple path param validation
    if (!communityId) throw new AppError("Missing Community ID", 400);

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const messages = await getCommunityMessages(communityId, limit, offset);
    return NextResponse.json({ messages });
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: communityId } = await params;
    const body = await request.json();

    // Validations
    sendMessageSchema.parse({ communityId, content: body.content });

    if (!body.userId) {
      throw new AppError("Missing userId to send message. Please log in.", 401);
    }

    const result = await sendMessage(body.userId, communityId, body.content.trim());

    return NextResponse.json({ message: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
