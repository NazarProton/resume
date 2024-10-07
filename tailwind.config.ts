import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        redBS: '#FB3640',
        gray: '#191919',
      },
      fontFamily: {
        geo: ['Geo'],
      },
      screens: {
        pc360: '360px',
        pc390: '390px',
        pc410: '410px',
        pc425: '425px',
        pc450: '450px',
        pc470: '470px',
        pc485: '485px',
        pc500: '500px',
        pc510: '510px',
        pc532: '532px',
        pc550: '550px',
        pc600: '600px',
        pc660: '660px',
        pc604: '604px',
        pc700: '700px',
        pc703: '703px',
        pc740: '740px',
        pc750: '750px',
        pc770: '770px',
        pc768: '768px',
        pc800: '800px',
        pc820: '820px',
        pc835: '835px',
        pc837: '837px',
        pc850: '850px',
        pc860: '860px',
        pc865: '865px',
        pc870: '870px',
        pc900: '900px',
        pc950: '950px',
        pc1000: '1000px',
        pc1024: '1024px',
        pc1025: '1025px',
        pc1067: '1067px',
        pc1100: '1100px',
        pc1120: '1120px',
        pc1180: '1180px',
        pc1200: '1200px',
        pc1220: '1220px',
        pc1250: '1250px',
        pc1280: '1280px',
        pc1265: '1265px',
        pc1300: '1300px',
        pc1510: '1510px',
        pc1500: '1500px',
        pc1921: '1921px',
        pc830h: { raw: '(min-height: 830px)' },
      },
    },
  },
};
export default config;
