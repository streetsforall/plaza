
import './index.css'

export const metadata = {
  title: 'Streets for All MailTo',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.png" sizes="any" />
      <script defer src="https://cloud.umami.is/script.js" data-website-id="79af4e69-5da3-464f-a844-ecfa00f5b7c3"></script>
      </head>
      <body >
        {children}
      </body>
    </html>
  )
}
