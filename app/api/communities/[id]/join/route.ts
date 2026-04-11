import { NextResponse } from 'next/server';
import { joinCommunity, AppError } from '@/lib/community-services';
import { joinCommunitySchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: communityId } = await params;
    
    // Zod validation for path parameters
    joinCommunitySchema.parse({ communityId });

    // Expecting userId in the JSON body payload for this architecture
    const body = await request.json();
    if (!body.userId) {
      throw new AppError("Missing userId in request body", 401);
    }

    const result = await joinCommunity(body.userId, communityId);

    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Join community error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
