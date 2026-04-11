import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { communities, communityMembers } from '@/src/db/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Left join or subquery to get participants count. For now just selecting all communities.
    const allCommunities = await db.select().from(communities);
    return NextResponse.json({ communities: allCommunities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
