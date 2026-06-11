import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { tag, secret } = await request.json();

    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    if (!tag) {
      return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
    }

    revalidateTag(tag);

    return NextResponse.json({ revalidated: true, now: Date.now(), tag });
  } catch (error) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
