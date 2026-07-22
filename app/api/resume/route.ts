import { NextResponse } from 'next/server';
import { readResumeDocument, writeResumeDocument } from '../../../src/lib/resumeStore';
import { ResumeDocumentType } from '../../../src/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await readResumeDocument();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to read resume data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as ResumeDocumentType;
    await writeResumeDocument(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save resume data' }, { status: 500 });
  }
}
