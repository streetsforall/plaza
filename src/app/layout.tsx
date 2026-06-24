import { Inter, Space_Mono } from 'next/font/google';
import './index.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const space_mono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  weight: '400',
});

export const metadata = {
  title: 'Streets for All MailTo',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${space_mono.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="79af4e69-5da3-464f-a844-ecfa00f5b7c3"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
