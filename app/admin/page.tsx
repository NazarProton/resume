import AdminPage from '../../src/views/AdminPage';
import { readResumeData } from '../../src/lib/resumeStore';

export const dynamic = 'force-dynamic';

export default async function AdminRoutePage() {
  const resumeData = await readResumeData();
  return <AdminPage resumeData={resumeData} />;
}

