import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const root = process.cwd();

const filesToScan = [
  'data/resume.json',
  'public/data/resume.default.json',
  'src/Assets/myInfo.json',
  'src/lib/resumeStore.ts',
  'src/views/ResumePage.tsx',
  'src/views/AdminPage.tsx',
  'src/components/WorkExpetience.tsx',
  'src/components/TechSkils.tsx',
  'app/layout.tsx',
].map((file) => resolve(root, file));

const jsonFiles = [
  'data/resume.json',
  'public/data/resume.default.json',
  'src/Assets/myInfo.json',
].map((file) => resolve(root, file));

const mojibakeTokens = [
  '\\uFFFD',
  '\\?{4,}',
  '\\u00C3\\u0080',
  '\\u00C3\\u0090',
  '\\u00C3\\u00A9',
  '\\u00D0\\u00A0',
  '\\u00D0\\u00A1',
  '\\u0420\\u0459',
  '\\u0420\\u045A',
  '\\u0420\\u2020',
  '\\u0420\\u2026',
  '\\u0420\\u0406',
  '\\u0420\\u040F',
  '\\u0420\\u0453',
  '\\u0420\\u0454',
  '\\u0420\\u0455',
  '\\u0420\\u0402',
  '\\u0421\\u0453',
  '\\u0421\\u040F',
  '\\u0421\\u2013',
  '\\u0421\\u2014',
  '\\u0421\\u201A',
  '\\u0421\\u201C',
  '\\u0421\\u201D',
  '\\u0421\\u2030',
  '\\u0421\\u0452',
  'J\\u0414\\u2122',
  '\\u0414\\u2122',
  '\\u0415\\u203A',
  '\\u0415\\u201A',
  '\\u0415\\u201E',
  '\\u0415\\u045A',
  '\\u0415\\u045B',
  '\\u0415\\u017A',
  '\\u0415\\u00BC',
  '\\u0415\\u00BA',
].map((pattern) => new RegExp(pattern, 'u'));

const badSamples = [
  'РљРѕРЅС‚Р°РєС‚Рё:',
  'РњРѕРІРё:',
  'Р—Р°РІР°РЅС‚Р°Р¶РёС‚Рё PDF',
  '05/2025 - ???????',
  'JД™zyki:',
  'UmiejД™tnoЕ›ci techniczne:',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findMojibake(text) {
  return mojibakeTokens
    .filter((pattern) => pattern.test(text))
    .map((pattern) => pattern.source);
}

function validateDetector() {
  for (const sample of badSamples) {
    assert(
      findMojibake(sample).length > 0,
      `Mojibake detector missed known bad sample: ${sample}`,
    );
  }
}

function validateJsonShape(file, value) {
  const content = value.content ?? value;
  for (const locale of ['en', 'uk', 'pl']) {
    const info = content[locale];
    assert(info, `${file}: missing ${locale} locale`);
    assert(info.profile?.name, `${file}: missing ${locale}.profile.name`);
    assert(info.profile?.title, `${file}: missing ${locale}.profile.title`);
    assert(Array.isArray(info.experience), `${file}: missing ${locale}.experience array`);
    assert(info.experience.length >= 8, `${file}: ${locale}.experience looks truncated`);
  }
}

function validateLocaleText(file, value) {
  const content = value.content ?? value;
  const ukText = JSON.stringify(content.uk);
  assert(/[А-Яа-яІіЇїЄєҐґ]/u.test(ukText), `${file}: uk locale has no Ukrainian Cyrillic`);

  const plText = JSON.stringify(content.pl);
  assert(!/[РС][Ѐ-ӿ]/u.test(plText), `${file}: pl locale contains Cyrillic-looking mojibake`);
  assert(!/[А-Яа-яІіЇїЄєҐґ]/u.test(plText), `${file}: pl locale contains untranslated Cyrillic text`);
  assert(!/[А-Яа-яІіЇїЄєҐґ]/u.test(JSON.stringify(content.en)), `${file}: en locale contains untranslated Cyrillic text`);
  const companies = content.en.experience.map((job) => job.company);
  for (const locale of ['en', 'uk', 'pl']) {
    assert(JSON.stringify(content[locale].experience.map((job) => job.company)) === JSON.stringify(companies), `${file}: ${locale} work history differs from English`);
    for (const [group, skills] of Object.entries(content[locale].techSkills)) {
      assert(skills.length > 0, `${file}: ${locale}.${group} is empty`);
      assert(new Set(skills).size === skills.length, `${file}: ${locale}.${group} has duplicate skills`);
    }
  }
}

function scanTextFiles() {
  const failures = [];

  for (const file of filesToScan) {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(readFileSync(file));
    const matches = findMojibake(text);
    if (matches.length > 0) {
      failures.push(`${relative(root, file)}: suspicious mojibake patterns ${matches.join(', ')}`);
    }
  }

  return failures;
}

function scanJsonFiles() {
  const failures = [];

  for (const file of jsonFiles) {
    try {
      const value = JSON.parse(readFileSync(file, 'utf8'));
      validateJsonShape(relative(root, file), value);
      validateLocaleText(relative(root, file), value);
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  return failures;
}

validateDetector();

const copies = jsonFiles.map((file) => {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  return JSON.stringify(data.content ?? data);
});
assert(copies.every((value) => value === copies[0]), 'Resume content copies have drifted');

const failures = [...scanTextFiles(), ...scanJsonFiles()];

if (failures.length > 0) {
  console.error('Resume text validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Resume text validation passed.');
