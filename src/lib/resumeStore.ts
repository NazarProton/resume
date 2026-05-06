import { promises as fs } from 'node:fs';
import path from 'node:path';
import { MyInfoByLocaleType } from '../types';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'resume.json');

export async function readResumeData(): Promise<MyInfoByLocaleType> {
  const content = await fs.readFile(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(content) as MyInfoByLocaleType;
}

export async function writeResumeData(data: MyInfoByLocaleType): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
