import Script from 'next/script';
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${source_sans.variable} ${space_mono.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="79af4e69-5da3-464f-a844-ecfa00f5b7c3"
        />
      </head>
      <body className="bg-sfa-tan">
        <div className="container m-auto min-h-screen">{children}</div>
      </body>
    </html>
  );
}
