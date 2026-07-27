import Image from 'next/image';
import Script from 'next/script';
import { Inter, Source_Sans_3, Space_Mono } from 'next/font/google';
import Footer from '../components/footer';
import Redirect from './components/Redirect';
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
        <link rel="icon" href="/images/SFA_logo.png" />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="79af4e69-5da3-464f-a844-ecfa00f5b7c3"
        />
      </head>
      <body className="bg-sfa-tan">
        <div className="m-auto flex min-h-screen max-w-2xl flex-col">
          {/* Handle old URL format (requires client component to access URL hash) */}
          <Redirect />

          <header className="mx-auto flex flex-col items-center gap-2 py-16">
            <a href="https://www.streetsforall.org">
              <Image
                src="/images/SFA_logo_wide.png"
                alt="Streets For All logo"
                height={0}
                width={320}
                className="h-auto max-w-full"
              />
            </a>
          </header>

          <div className="grow">
            <div className="rounded-2xl bg-white p-10">{children}</div>
          </div>

          <footer className="flex max-w-full flex-col gap-2 p-12 text-center text-xs text-stone-500">
            <p>This tool is a work in progress!</p>
            <p>
              Suggestions or issues? Email{' '}
              <a href="mailto:josh@streetsforall.org">josh@streetsforall.org</a>
              .
            </p>
            <p>Built with care by the Streets for All Data/Dev Team</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
