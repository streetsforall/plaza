import { Inter, Source_Sans_3, Space_Mono } from 'next/font/google';
import './index.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const source_sans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
  weight: ['400', '700'],
});

const space_mono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
  weight: '400',
});

export const metadata = {
  title: 'Streets for All MailTo',
  description: '',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${source_sans.variable} ${space_mono.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className="bg-sfa-tan">
        {children}
      </body>
    </html>
  );
}
