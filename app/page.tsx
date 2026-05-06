import ResumePage from '../src/views/ResumePage';
import { readResumeData } from '../src/lib/resumeStore';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const resumeData = await readResumeData();
  return <ResumePage resumeData={resumeData} />;
}

