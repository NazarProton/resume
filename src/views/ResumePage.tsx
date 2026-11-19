'use client';

import { useState } from 'react';
import Image from 'next/image';
import myPhoto from '../Assets/myPhoto.webp';
import TechSkills from '../components/TechSkils';
import WorkExperience from '../components/WorkExpetience';
import { Locale, ResumeDocumentType } from '../types';

const LANGUAGE_NAMES = { en: 'English', uk: 'Українська', pl: 'Polski' };

function ResumePage({ resumeDocument }: { resumeDocument: ResumeDocumentType }) {
  const [locale, setLocale] = useState<Locale>('en');
  const info = resumeDocument.content[locale] ?? resumeDocument.content.en;
  const ui = resumeDocument.uiText[locale] ?? resumeDocument.uiText.en;

  const selectLocale = (nextLocale: Locale) => {
    setLocale(nextLocale);
    document.documentElement.setAttribute('lang', nextLocale);
  };

  return (
    <main className="resume-shell">
      <div className="resume-toolbar">
        <nav aria-label="Resume language" className="resume-languages">
          {(['en', 'uk', 'pl'] as Locale[]).map((lang) => (
            <button key={lang} type="button" lang={lang} aria-label={LANGUAGE_NAMES[lang]}
              aria-pressed={locale === lang} onClick={() => selectLocale(lang)}>
              {lang.toUpperCase()}
            </button>
          ))}
        </nav>
        <button className="resume-pdf" type="button" onClick={() => window.print()}>
          {ui.downloadPdf}
        </button>
      </div>
      <article className="resume-document" data-resume-root="true" lang={locale}>
        <header className="resume-header">
          <div>
            <h1>{info.profile.name}</h1>
            <p className="resume-title">{info.profile.title}</p>
            {info.profile.focus ? <p className="resume-focus">{info.profile.focus}</p> : null}
            <ul className="resume-contact-list" aria-label={ui.contacts}>
              <li>{info.contacts.location}</li>
              <li><a href={`mailto:${info.contacts.email}`}>{info.contacts.email}</a></li>
              <li><a href={`tel:${info.contacts.phone.replace(/\s/g, '')}`}>{info.contacts.phone}</a></li>
            </ul>
            <ul className="resume-social-list">
              {(['linkedin', 'github', 'telegram'] as const).map((social) => (
                <li key={social}><a href={info.contacts.socials[social]}>
                  {info.contacts.socials[social].replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                </a></li>
              ))}
            </ul>
          </div>
          <Image className="resume-photo" src={myPhoto} alt={info.profile.name}
            width={900} height={1350} priority />
        </header>
        <p className="resume-summary">{info.profile.description}</p>
        <div className="resume-body">
          <div className="resume-experience">
            <WorkExperience MyInfo={info} labels={{ title: ui.workExperience, projectsAt: ui.projectsAt }} />
          </div>
          <aside className="resume-sidebar">
            <TechSkills MyInfo={info} labels={ui.tech} />
            <div className="resume-support">
              <section>
                <h2>{ui.languages}</h2>
                <ul className="resume-language-list">
                  {info.languages.map((language) => (
                    <li key={language.name}><strong>{language.name}</strong> · {language.level}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h2>{ui.education}</h2>
                {info.education.map((education) => (
                  <p key={education.institution} className="resume-education">
                    <strong>{education.institution}</strong><br />{education.program}
                  </p>
                ))}
              </section>
              <section className="resume-strengths">
                <h2>{ui.softSkills}</h2>
                <p>{info.softSkills.join(' · ')}</p>
              </section>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

export default ResumePage;
