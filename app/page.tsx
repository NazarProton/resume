import ResumePage from '../src/views/ResumePage';
import { readResumeDocument } from '../src/lib/resumeStore';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const resumeDocument = await readResumeDocument();
  return <ResumePage resumeDocument={resumeDocument} />;
}

