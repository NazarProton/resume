'use client';

import { FormEvent, useMemo, useState } from 'react';
import JsonEditor from '../components/admin/JsonEditor';
import { MyInfoByLocaleType } from '../types';

type Props = {
  resumeData: MyInfoByLocaleType;
};

const DEFAULT_JSON_PATH = '/data/resume.default.json';

function AdminPage({ resumeData }: Props) {
  const [draftData, setDraftData] = useState<MyInfoByLocaleType>(resumeData);
  const [rawText, setRawText] = useState(JSON.stringify(resumeData, null, 2));
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const syncRawText = (data: MyInfoByLocaleType) => {
    setRawText(JSON.stringify(data, null, 2));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('Saving...');
    try {
      const response = await fetch('/api/resume', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftData),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      setMessage('Saved to data/resume.json');
    } catch {
      setMessage('Failed to save. Check server logs.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplyRaw = (e: FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(rawText) as MyInfoByLocaleType;
      setDraftData(parsed);
      setMessage('Raw JSON applied to editor draft');
    } catch {
      setMessage('Invalid JSON format');
    }
  };

  const handleResetDefault = async () => {
    try {
      const response = await fetch(DEFAULT_JSON_PATH, { cache: 'no-store' });
      if (!response.ok) throw new Error('failed');
      const defaults = (await response.json()) as MyInfoByLocaleType;
      setDraftData(defaults);
      syncRawText(defaults);
      setMessage('Default JSON loaded to draft. Click Save to persist.');
    } catch {
      setMessage('Failed to load default JSON');
    }
  };

  const jsonSize = useMemo(() => rawText.length, [rawText]);

  return (
    <main className="min-h-screen bg-gray-100 p-4 font-play text-black">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">Resume Admin</h1>
          <div className="flex flex-wrap gap-2">
            <a
              href="/"
              className="rounded bg-slate-700 px-3 py-2 text-xs font-semibold text-white"
            >
              Back to Resume
            </a>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([JSON.stringify(draftData, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'resume-data.json';
                link.click();
                URL.revokeObjectURL(url);
                setMessage('JSON exported');
              }}
              className="rounded bg-indigo-600 px-3 py-2 text-xs font-semibold text-white"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="rounded bg-red-600 px-3 py-2 text-xs font-semibold text-white"
            >
              Reset Draft
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-70"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="rounded border border-gray-300 bg-white p-4">
          <p className="text-sm text-gray-700">
            You can edit every field with pen label, add with + buttons, and delete any item
            (jobs, skills, keywords, descriptions, links).
          </p>
          <p className="mt-1 text-xs text-gray-500">JSON size: {jsonSize} chars</p>
          {message ? <p className="mt-1 text-sm font-semibold text-emerald-700">{message}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded border border-gray-300 bg-white p-4">
            <h2 className="mb-3 text-lg font-bold">Visual JSON Editor</h2>
            <JsonEditor
              value={draftData}
              onChange={(nextData) => {
                const typed = nextData as MyInfoByLocaleType;
                setDraftData(typed);
                syncRawText(typed);
              }}
            />
          </section>

          <section className="rounded border border-gray-300 bg-white p-4">
            <h2 className="mb-3 text-lg font-bold">Raw JSON</h2>
            <form onSubmit={handleApplyRaw} className="flex flex-col gap-2">
              <textarea
                className="min-h-[36rem] w-full rounded border border-gray-300 p-2 font-mono text-xs"
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
              />
              <button
                type="submit"
                className="self-start rounded bg-black px-3 py-2 text-xs font-semibold text-white"
              >
                Apply Raw JSON
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminPage;
