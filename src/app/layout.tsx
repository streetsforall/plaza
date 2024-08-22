
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
      </head>
      <body >
        {children}
      </body>
    </html>
  )
}
