'use client';

import { useRef, useState } from 'react';
import { useEffect } from 'react';
import Description from '../components/Description';
import ProfileInfo from '../components/ProfileInfo';
import myPhoto from '../Assets/myPhoto.webp';
import TechSkills from '../components/TechSkils';
import WorkExperience from '../components/WorkExpetience';
import Socials from '../components/Socials';
import Contacts from '../components/Contacts';
import Languages from '../components/Languages';
import Education from '../components/Education';
import SoftSkills from '../components/SoftSkills';
import { Locale, MyInfoByLocaleType } from '../types';

const PDF_ZOOM = 0.95;
const PDF_PAGE_MARGIN_MM = 8;
const PDF_CAPTURE_WIDTH = 1280;

const UI_TEXT: Record<
  Locale,
  {
    contacts: string;
    languages: string;
    softSkills: string;
    education: string;
    workExperience: string;
    projectsAt: string;
    tech: {
      title: string;
      frontend: string;
      backend: string;
      blockchain: string;
      tools: string;
    };
    downloadPdf: string;
    generatingPdf: string;
  }
> = {
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

type Props = {
  resumeData: MyInfoByLocaleType;
};

function ResumePage({ resumeData }: Props) {
  const [locale, setLocale] = useState<Locale>('en');
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [canOpenAdmin, setCanOpenAdmin] = useState(false);
  const currentInfo = resumeData[locale] ?? resumeData.en;
  const uiText = UI_TEXT[locale];

  useEffect(() => {
    let isMounted = true;

    const checkAdminAccess = async () => {
      try {
        const response = await fetch('/api/resume', { cache: 'no-store' });
        if (!isMounted) return;
        setCanOpenAdmin(response.ok);
      } catch {
        if (!isMounted) return;
        setCanOpenAdmin(false);
      }
    };

    checkAdminAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownloadPdf = async () => {
    if (!resumeRef.current || isDownloadingPdf) return;

    setIsDownloadingPdf(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: PDF_CAPTURE_WIDTH,
        onclone: (doc: Document) => {
          const clonedResume = doc.querySelector(
            '[data-resume-root="true"]',
          ) as HTMLElement | null;
          if (!clonedResume) return;

          clonedResume.style.width = '1024px';
          clonedResume.style.maxWidth = '1024px';
          clonedResume.style.margin = '0 auto';
          clonedResume.style.boxShadow = 'none';
          clonedResume.style.backgroundColor = '#ffffff';
        },
      });

      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a2',
        orientation: 'portrait',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxWidth = pageWidth - PDF_PAGE_MARGIN_MM * 2;
      const maxHeight = pageHeight - PDF_PAGE_MARGIN_MM * 2;
      const fitScale =
        Math.min(maxWidth / canvas.width, maxHeight / canvas.height) * PDF_ZOOM;
      const renderWidth = canvas.width * fitScale;
      const renderHeight = canvas.height * fitScale;
      const offsetX = (pageWidth - renderWidth) / 2;
      const offsetY = (pageHeight - renderHeight) / 2;

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.98),
        'JPEG',
        offsetX,
        offsetY,
        renderWidth,
        renderHeight,
        undefined,
        'FAST',
      );
      pdf.save(`Proton-Nazar-Resume-${locale.toUpperCase()}.pdf`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <main className="p-0 m-0 w-full h-full flex justify-center font-play text-black">
      <div
        ref={resumeRef}
        data-resume-root="true"
        className="flex mt-10 mb-5 w-11/12 max-w-[64rem] flex-col bg-white shadow-2xl"
      >
        <div className="flex pc700:flex-row flex-col pb-5">
          <div className="pc700:w-[40%] w-full flex flex-col items-center">
            <img
              className="pc700:rounded-full object-cover pc700:mt-10 z-10 w-11/12 aspect-square"
              src={myPhoto.src}
              alt="Profile"
            />
            <div className="w-10/12">
              <ProfileInfo MyInfo={currentInfo} isForSmallScreen />
              <Contacts MyInfo={currentInfo} title={uiText.contacts} />
            </div>
            <div className="w-10/12">
              <Socials MyInfo={currentInfo} />
              <Description MyInfo={currentInfo} isForSmallScreen />
              <Languages MyInfo={currentInfo} title={uiText.languages} />
              <SoftSkills MyInfo={currentInfo} title={uiText.softSkills} />
              <TechSkills MyInfo={currentInfo} labels={uiText.tech} />
              <Education MyInfo={currentInfo} title={uiText.education} />
            </div>
          </div>
          <div className="pc700:w-[60%] w-full flex justify-center bg-whiteInherit">
            <div className="w-10/12 flex flex-col pc700:mt-10">
              <ProfileInfo MyInfo={currentInfo} />
              <div className="flex flex-col gap-2">
                <div className="pc700:mt-5 flex flex-col">
                  <WorkExperience
                    MyInfo={currentInfo}
                    labels={{
                      title: uiText.workExperience,
                      projectsAt: uiText.projectsAt,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        data-html2canvas-ignore="true"
        className="fixed top-4 right-4 z-50 flex gap-1 rounded-lg bg-black/80 p-1 print:hidden"
      >
        {(['en', 'uk', 'pl'] as Locale[]).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLocale(lang)}
            className={`rounded px-2 py-1 text-xs font-bold text-white transition-opacity ${
              locale === lang ? 'bg-orange-500' : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
      {canOpenAdmin ? (
        <a
          href="/admin"
          data-html2canvas-ignore="true"
          className="fixed bottom-16 right-4 z-50 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 print:hidden"
        >
          Admin
        </a>
      ) : null}
      <button
        data-html2canvas-ignore="true"
        type="button"
        onClick={handleDownloadPdf}
        disabled={isDownloadingPdf}
        className="fixed bottom-4 right-4 z-50 rounded-lg bg-black px-4 py-2 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 print:hidden"
      >
        {isDownloadingPdf ? uiText.generatingPdf : uiText.downloadPdf}
      </button>
    </main>
  );
}

export default ResumePage;

