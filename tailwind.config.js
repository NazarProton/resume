/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html'],
  theme: {
    extend: {
      colors: {
        cyan: '#20C4D8',
        green: '#1FC796',
        yellow: '#F2BC53',
        blue: '#5D79CA',
        white: '#FFFFFF',
        whiteInherit: '#ffffff1d',
        whiteInheriter: '#202D46',
        whiteInheritLess: '#ffffff1d',
        dark: '#14223C',
        red: '#FF375B',
      },
      screens: {
        pc360: '360px',
        pc395: '395px',
        pc650: '650px',
        pc830: '830px',
      },
      fontFamily: {
        play: ['Play'],
        orbit: ['Orbitron'],
      },
    },
  },
};
