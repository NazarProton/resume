import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nazar Proton | Senior Full-Stack Developer',
  description: 'TypeScript, React, Next.js and Node.js. Full-stack development, AI interfaces, e-commerce, Web3 and production delivery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/protonLogo.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
