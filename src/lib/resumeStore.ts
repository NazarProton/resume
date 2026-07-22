import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  Locale,
  MyInfoByLocaleType,
  ResumeDocumentType,
  ResumeUiText,
  ResumeUiTextByLocaleType,
} from '../types';

const LEGACY_DATA_FILE_PATH = path.join(process.cwd(), 'data', 'resume.json');
const DEFAULT_DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'resume.default.json');
const FILE_STORE_PATH = process.env.RESUME_DATA_FILE
  ? path.resolve(process.env.RESUME_DATA_FILE)
  : LEGACY_DATA_FILE_PATH;
const KV_KEY = process.env.RESUME_KV_KEY ?? 'resume:content';
const KV_REST_API_URL =
  process.env.RESUME_KV_REST_API_URL ??
  process.env.KV_REST_API_URL ??
  process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_API_TOKEN =
  process.env.RESUME_KV_REST_API_TOKEN ??
  process.env.KV_REST_API_TOKEN ??
  process.env.UPSTASH_REDIS_REST_TOKEN;
const LOCALES: Locale[] = ['en', 'uk', 'pl'];

const DEFAULT_UI_TEXT: ResumeUiTextByLocaleType = {
  en: {
    contacts: 'Contacts:',
    languages: 'Languages:',
    softSkills: 'Soft Skills:',
    education: 'Education:',
    workExperience: 'Work Experience:',
    projectsAt: 'Projects at',
    tech: {
      title: 'Tech Skills:',
      frontend: 'Frontend:',
      backend: 'Backend:',
      blockchain: 'Blockchain:',
      tools: 'Tools:',
    },
    downloadPdf: 'Download PDF',
    generatingPdf: 'Generating PDF...',
  },
  uk: {
    contacts: 'Контакти:',
    languages: 'Мови:',
    softSkills: "М'які навички:",
    education: 'Освіта:',
    workExperience: 'Досвід роботи:',
    projectsAt: 'Проєкти в',
    tech: {
      title: 'Технічні навички:',
      frontend: 'Frontend:',
      backend: 'Backend:',
      blockchain: 'Blockchain:',
      tools: 'Інструменти:',
    },
    downloadPdf: 'Завантажити PDF',
    generatingPdf: 'Генерую PDF...',
  },
  pl: {
    contacts: 'Kontakt:',
    languages: 'Języki:',
    softSkills: 'Umiejętności miękkie:',
    education: 'Edukacja:',
    workExperience: 'Doświadczenie zawodowe:',
    projectsAt: 'Projekty w',
    tech: {
      title: 'Umiejętności techniczne:',
      frontend: 'Frontend:',
      backend: 'Backend:',
      blockchain: 'Blockchain:',
      tools: 'Narzędzia:',
    },
    downloadPdf: 'Pobierz PDF',
    generatingPdf: 'Tworzenie PDF...',
  },
};

type UpstashResponse<T> = {
  result?: T;
  error?: string;
};

function hasLocaleContent(value: unknown): value is MyInfoByLocaleType {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Record<Locale, unknown>>;
  return LOCALES.every((locale) => Boolean(candidate[locale]));
}

function mergeUiText(value: Partial<ResumeUiTextByLocaleType> | undefined): ResumeUiTextByLocaleType {
  return LOCALES.reduce((acc, locale) => {
    const defaults = DEFAULT_UI_TEXT[locale];
    const current = value?.[locale] as Partial<ResumeUiText> | undefined;

    acc[locale] = {
      ...defaults,
      ...current,
      tech: {
        ...defaults.tech,
        ...current?.tech,
      },
    };

    return acc;
  }, {} as ResumeUiTextByLocaleType);
}

function normalizeResumeDocument(value: unknown): ResumeDocumentType {
  if (
    value &&
    typeof value === 'object' &&
    'content' in value &&
    hasLocaleContent((value as Partial<ResumeDocumentType>).content)
  ) {
    const document = value as Partial<ResumeDocumentType>;

    return {
      content: document.content as MyInfoByLocaleType,
      uiText: mergeUiText(document.uiText),
      updatedAt: document.updatedAt,
    };
  }

  if (hasLocaleContent(value)) {
    return {
      content: value,
      uiText: mergeUiText(undefined),
    };
  }

  throw new Error('Invalid resume data shape');
}

async function readJsonFile(filePath: string): Promise<ResumeDocumentType> {
  const content = await fs.readFile(filePath, 'utf-8');
  return normalizeResumeDocument(JSON.parse(content));
}

async function readSeedData(): Promise<ResumeDocumentType> {
  try {
    return await readJsonFile(DEFAULT_DATA_FILE_PATH);
  } catch {
    return readJsonFile(LEGACY_DATA_FILE_PATH);
  }
}

function canUseKvStore() {
  return Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);
}

async function kvCommand<T>(command: unknown[]): Promise<T | undefined> {
  if (!KV_REST_API_URL || !KV_REST_API_TOKEN) return undefined;

  const response = await fetch(KV_REST_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_REST_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });

  const payload = (await response.json()) as UpstashResponse<T>;
  if (!response.ok || payload.error) {
    throw new Error(payload.error ?? 'Resume KV request failed');
  }

  return payload.result;
}

async function readKvResumeData(): Promise<ResumeDocumentType> {
  const storedValue = await kvCommand<string | null>(['GET', KV_KEY]);

  if (storedValue) {
    return normalizeResumeDocument(JSON.parse(storedValue));
  }

  const seedData = await readSeedData();
  await writeKvResumeData(seedData);
  return seedData;
}

async function writeKvResumeData(data: ResumeDocumentType): Promise<void> {
  await kvCommand(['SET', KV_KEY, JSON.stringify(data)]);
}

async function readFileResumeData(): Promise<ResumeDocumentType> {
  try {
    return await readJsonFile(FILE_STORE_PATH);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code !== 'ENOENT') throw error;

    const seedData = await readSeedData();
    await writeFileResumeData(seedData);
    return seedData;
  }
}

async function writeFileResumeData(data: ResumeDocumentType): Promise<void> {
  await fs.mkdir(path.dirname(FILE_STORE_PATH), { recursive: true });

  const tempFilePath = `${FILE_STORE_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tempFilePath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempFilePath, FILE_STORE_PATH);
}

export async function readResumeDocument(): Promise<ResumeDocumentType> {
  if (canUseKvStore()) {
    return readKvResumeData();
  }

  return readFileResumeData();
}

export async function writeResumeDocument(data: ResumeDocumentType): Promise<void> {
  const nextData = normalizeResumeDocument({
    ...data,
    updatedAt: new Date().toISOString(),
  });

  if (canUseKvStore()) {
    await writeKvResumeData(nextData);
    return;
  }

  await writeFileResumeData(nextData);
}

export async function readResumeData(): Promise<MyInfoByLocaleType> {
  const document = await readResumeDocument();
  return document.content;
}

export async function writeResumeData(data: MyInfoByLocaleType): Promise<void> {
  const currentDocument = await readResumeDocument();
  await writeResumeDocument({
    ...currentDocument,
    content: data,
  });
}
