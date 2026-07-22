import AdminPage from '../../src/views/AdminPage';
import { readResumeDocument } from '../../src/lib/resumeStore';

export const dynamic = 'force-dynamic';

export default async function AdminRoutePage() {
  const resumeDocument = await readResumeDocument();
  return <AdminPage resumeDocument={resumeDocument} />;
}

