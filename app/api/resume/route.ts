import { NextResponse } from 'next/server';
import { readResumeData, writeResumeData } from '../../../src/lib/resumeStore';
import { MyInfoByLocaleType } from '../../../src/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await readResumeData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read resume data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as MyInfoByLocaleType;
    await writeResumeData(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save resume data' }, { status: 500 });
  }
}
