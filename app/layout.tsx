import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Proton Nazar DEV',
  description: 'Personal resume with admin editor',
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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
