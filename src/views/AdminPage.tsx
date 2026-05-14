'use client';

import { useMemo, useState } from 'react';
import { Locale, MyInfoByLocaleType, MyInfoType } from '../types';

type Props = {
  resumeData: MyInfoByLocaleType;
};

type TechGroup = keyof MyInfoType['techSkills'];

type EditTarget =
  | { kind: 'profile'; title: string }
  | { kind: 'contacts'; title: string }
  | { kind: 'techSkills'; group: TechGroup; title: string }
  | { kind: 'softSkills'; title: string }
  | { kind: 'language'; index: number; title: string }
  | { kind: 'education'; index: number; title: string }
  | { kind: 'experience'; index: number; title: string };

const LOCALES: Locale[] = ['en', 'uk', 'pl'];

const TECH_LABELS: Record<TechGroup, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  blockchain: 'Blockchain',
  tools: 'Tools',
};

const cloneData = (data: MyInfoByLocaleType): MyInfoByLocaleType =>
  JSON.parse(JSON.stringify(data)) as MyInfoByLocaleType;

const linesToList = (value: string) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

function AdminPage({ resumeData }: Props) {
  const [draftData, setDraftData] = useState<MyInfoByLocaleType>(resumeData);
  const [modalData, setModalData] = useState<MyInfoByLocaleType | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const preview = draftData.en;
  const modalTitle = editTarget?.title ?? '';

  const openEditor = (target: EditTarget) => {
    setEditTarget(target);
    setModalData(cloneData(draftData));
    setMessage('');
  };

  const closeEditor = () => {
    if (isSaving) return;
    setEditTarget(null);
    setModalData(null);
  };

  const updateLocale = (locale: Locale, updater: (info: MyInfoType) => void) => {
    setModalData((current) => {
      if (!current) return current;
      const next = cloneData(current);
      updater(next[locale]);
      return next;
    });
  };

  const saveData = async (nextData: MyInfoByLocaleType, successMessage: string) => {
    setIsSaving(true);
    setMessage('Saving...');
    try {
      const response = await fetch('/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nextData),
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      setDraftData(nextData);
      setMessage(successMessage);
      return true;
    } catch {
      setMessage('Failed to save. Check server logs.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalSave = async () => {
    if (!modalData) return;
    const didSave = await saveData(modalData, 'Saved');
    if (didSave) {
      setEditTarget(null);
      setModalData(null);
    }
  };

  const jsonSize = useMemo(() => JSON.stringify(draftData).length, [draftData]);

  return (
    <main className="min-h-screen bg-zinc-100 p-4 font-play text-zinc-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-300 pb-4">
          <div>
            <h1 className="text-2xl font-bold">Resume Admin</h1>
            <p className="text-sm text-zinc-600">
              Edit one resume block at a time, across EN / UK / PL.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500">JSON: {jsonSize} chars</span>
            <a
              href="/"
              className="rounded bg-zinc-800 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
            >
              Back to Resume
            </a>
          </div>
        </header>

        {message ? (
          <div className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
            {message}
          </div>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[22rem_1fr]">
          <aside className="flex flex-col gap-3">
            <SectionCard
              title="Profile"
              actionLabel="Edit profile"
              onEdit={() => openEditor({ kind: 'profile', title: 'Profile' })}
            >
              <p className="text-xl font-bold">{preview.profile.name}</p>
              <p className="text-sm text-zinc-700">{preview.profile.title}</p>
              <p className="mt-2 line-clamp-4 text-sm text-zinc-600">
                {preview.profile.description}
              </p>
            </SectionCard>

            <SectionCard
              title="Contacts"
              actionLabel="Edit contacts"
              onEdit={() => openEditor({ kind: 'contacts', title: 'Contacts' })}
            >
              <InfoLine label="Email" value={preview.contacts.email} />
              <InfoLine label="Phone" value={preview.contacts.phone} />
              <InfoLine label="Location" value={preview.contacts.location} />
            </SectionCard>

            <SectionCard
              title="Soft Skills"
              actionLabel="Edit soft skills"
              onEdit={() => openEditor({ kind: 'softSkills', title: 'Soft Skills' })}
            >
              <TagList items={preview.softSkills} />
            </SectionCard>
          </aside>

          <div className="flex flex-col gap-4">
            <Panel title="Work Experience">
              <div className="grid gap-3">
                {preview.experience.map((job, index) => (
                  <EditableRow
                    key={`${job.company}-${index}`}
                    title={job.company}
                    subtitle={`${job.position} | ${job.dates ?? ''} | ${job.location ?? ''}`}
                    body={job.description}
                    actionLabel={`Edit ${job.company}`}
                    onEdit={() =>
                      openEditor({
                        kind: 'experience',
                        index,
                        title: `Work: ${job.company}`,
                      })
                    }
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Tech Skills">
              <div className="grid gap-3 md:grid-cols-2">
                {(Object.keys(preview.techSkills) as TechGroup[]).map((group) => (
                  <SectionCard
                    key={group}
                    title={TECH_LABELS[group]}
                    actionLabel={`Edit ${TECH_LABELS[group]}`}
                    onEdit={() =>
                      openEditor({
                        kind: 'techSkills',
                        group,
                        title: `Tech Skills: ${TECH_LABELS[group]}`,
                      })
                    }
                  >
                    <TagList items={preview.techSkills[group]} />
                  </SectionCard>
                ))}
              </div>
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              <Panel title="Languages">
                <div className="grid gap-3">
                  {preview.languages.map((language, index) => (
                    <EditableRow
                      key={`${language.name}-${index}`}
                      title={language.name}
                      subtitle={language.level}
                      actionLabel={`Edit ${language.name}`}
                      onEdit={() =>
                        openEditor({
                          kind: 'language',
                          index,
                          title: `Language: ${language.name}`,
                        })
                      }
                    />
                  ))}
                </div>
              </Panel>

              <Panel title="Education">
                <div className="grid gap-3">
                  {preview.education.map((education, index) => (
                    <EditableRow
                      key={`${education.institution}-${index}`}
                      title={education.institution}
                      subtitle={education.program}
                      actionLabel={`Edit ${education.institution}`}
                      onEdit={() =>
                        openEditor({
                          kind: 'education',
                          index,
                          title: `Education: ${education.institution}`,
                        })
                      }
                    />
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </section>
      </div>

      {editTarget && modalData ? (
        <EditorModal
          title={modalTitle}
          target={editTarget}
          data={modalData}
          isSaving={isSaving}
          onClose={closeEditor}
          onSave={handleModalSave}
          updateLocale={updateLocale}
        />
      ) : null}
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-zinc-300 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

function SectionCard({
  title,
  actionLabel,
  children,
  onEdit,
}: {
  title: string;
  actionLabel: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <article className="border border-zinc-300 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="font-bold">{title}</h2>
        <EditButton label={actionLabel} onClick={onEdit} />
      </div>
      {children}
    </article>
  );
}

function EditableRow({
  title,
  subtitle,
  body,
  actionLabel,
  onEdit,
}: {
  title: string;
  subtitle?: string;
  body?: string;
  actionLabel: string;
  onEdit: () => void;
}) {
  return (
    <article className="border border-zinc-200 bg-zinc-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{title}</h3>
          {subtitle ? <p className="text-sm text-zinc-600">{subtitle}</p> : null}
        </div>
        <EditButton label={actionLabel} onClick={onEdit} />
      </div>
      {body ? <p className="mt-2 line-clamp-3 text-sm text-zinc-700">{body}</p> : null}
    </article>
  );
}

function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="shrink-0 rounded bg-orange-500 px-3 py-1 text-xs font-bold text-white hover:bg-orange-600"
    >
      Edit
    </button>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm">
      <span className="font-bold">{label}: </span>
      <span className="text-zinc-700">{value}</span>
    </p>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="bg-zinc-100 px-2 py-1 text-xs">
          {item}
        </li>
      ))}
    </ul>
  );
}

function EditorModal({
  title,
  target,
  data,
  isSaving,
  onClose,
  onSave,
  updateLocale,
}: {
  title: string;
  target: EditTarget;
  data: MyInfoByLocaleType;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  updateLocale: (locale: Locale, updater: (info: MyInfoType) => void) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-300 p-4">
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-sm text-zinc-600">Edit all languages in one place.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-zinc-200 px-3 py-2 text-sm font-bold hover:bg-zinc-300"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 overflow-auto p-4 lg:grid-cols-3">
          {LOCALES.map((locale) => (
            <LanguageEditor
              key={locale}
              locale={locale}
              target={target}
              data={data}
              updateLocale={updateLocale}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-300 p-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded bg-zinc-200 px-4 py-2 text-sm font-bold hover:bg-zinc-300 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LanguageEditor({
  locale,
  target,
  data,
  updateLocale,
}: {
  locale: Locale;
  target: EditTarget;
  data: MyInfoByLocaleType;
  updateLocale: (locale: Locale, updater: (info: MyInfoType) => void) => void;
}) {
  const info = data[locale];

  return (
    <section className="border border-zinc-300 bg-zinc-50 p-3">
      <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-zinc-700">
        {locale}
      </h3>
      <div className="flex flex-col gap-3">
        {renderFields(target, info, locale, updateLocale)}
      </div>
    </section>
  );
}

function renderFields(
  target: EditTarget,
  info: MyInfoType,
  locale: Locale,
  updateLocale: (locale: Locale, updater: (info: MyInfoType) => void) => void,
) {
  if (target.kind === 'profile') {
    return (
      <>
        <TextInput
          label="Name"
          value={info.profile.name}
          onChange={(value) => updateLocale(locale, (item) => { item.profile.name = value; })}
        />
        <TextInput
          label="Title"
          value={info.profile.title}
          onChange={(value) => updateLocale(locale, (item) => { item.profile.title = value; })}
        />
        <TextArea
          label="Description"
          value={info.profile.description}
          rows={8}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.profile.description = value; })
          }
        />
      </>
    );
  }

  if (target.kind === 'contacts') {
    return (
      <>
        <TextInput
          label="Location"
          value={info.contacts.location}
          onChange={(value) => updateLocale(locale, (item) => { item.contacts.location = value; })}
        />
        <TextInput
          label="Location Link"
          value={info.contacts.locationLink}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.contacts.locationLink = value; })
          }
        />
        <TextInput
          label="Phone"
          value={info.contacts.phone}
          onChange={(value) => updateLocale(locale, (item) => { item.contacts.phone = value; })}
        />
        <TextInput
          label="Email"
          value={info.contacts.email}
          onChange={(value) => updateLocale(locale, (item) => { item.contacts.email = value; })}
        />
        <TextInput
          label="Telegram"
          value={info.contacts.socials.telegram}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.contacts.socials.telegram = value; })
          }
        />
        <TextInput
          label="LinkedIn"
          value={info.contacts.socials.linkedin}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.contacts.socials.linkedin = value; })
          }
        />
        <TextInput
          label="Instagram"
          value={info.contacts.socials.instagram}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.contacts.socials.instagram = value; })
          }
        />
        <TextInput
          label="GitHub"
          value={info.contacts.socials.github}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.contacts.socials.github = value; })
          }
        />
      </>
    );
  }

  if (target.kind === 'techSkills') {
    return (
      <TextArea
        label={`${TECH_LABELS[target.group]} skills - one per line`}
        value={info.techSkills[target.group].join('\n')}
        rows={16}
        onChange={(value) =>
          updateLocale(locale, (item) => { item.techSkills[target.group] = linesToList(value); })
        }
      />
    );
  }

  if (target.kind === 'softSkills') {
    return (
      <TextArea
        label="Soft skills - one per line"
        value={info.softSkills.join('\n')}
        rows={16}
        onChange={(value) => updateLocale(locale, (item) => { item.softSkills = linesToList(value); })}
      />
    );
  }

  if (target.kind === 'language') {
    const language = info.languages[target.index];
    if (!language) return <MissingItem />;
    return (
      <>
        <TextInput
          label="Language"
          value={language.name}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.languages[target.index].name = value; })
          }
        />
        <TextInput
          label="Level"
          value={language.level}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.languages[target.index].level = value; })
          }
        />
      </>
    );
  }

  if (target.kind === 'education') {
    const education = info.education[target.index];
    if (!education) return <MissingItem />;
    return (
      <>
        <TextInput
          label="Institution"
          value={education.institution}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.education[target.index].institution = value; })
          }
        />
        <TextInput
          label="Program"
          value={education.program}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.education[target.index].program = value; })
          }
        />
      </>
    );
  }

  const job = info.experience[target.index];
  if (!job) return <MissingItem />;

  return (
    <>
      <TextInput
        label="Company"
        value={job.company}
        onChange={(value) =>
          updateLocale(locale, (item) => { item.experience[target.index].company = value; })
        }
      />
      <TextInput
        label="Position"
        value={job.position}
        onChange={(value) =>
          updateLocale(locale, (item) => { item.experience[target.index].position = value; })
        }
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <TextInput
          label="Dates"
          value={job.dates ?? ''}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.experience[target.index].dates = value; })
          }
        />
        <TextInput
          label="Location"
          value={job.location ?? ''}
          onChange={(value) =>
            updateLocale(locale, (item) => { item.experience[target.index].location = value; })
          }
        />
      </div>
      <TextInput
        label="Link"
        value={job.link ?? ''}
        onChange={(value) =>
          updateLocale(locale, (item) => { item.experience[target.index].link = value; })
        }
      />
      <TextArea
        label="Description"
        value={job.description}
        rows={10}
        onChange={(value) =>
          updateLocale(locale, (item) => { item.experience[target.index].description = value; })
        }
      />
    </>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-700">
      {label}
      <input
        className="rounded border border-zinc-300 bg-white px-3 py-2 font-normal text-zinc-950 outline-none focus:border-orange-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  rows,
  onChange,
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-700">
      {label}
      <textarea
        className="rounded border border-zinc-300 bg-white px-3 py-2 font-normal text-zinc-950 outline-none focus:border-orange-500"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function MissingItem() {
  return <p className="text-sm text-red-700">This item is missing in this language.</p>;
}

export default AdminPage;
