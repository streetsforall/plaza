
import './index.css'

export const metadata = {
  title: 'Streets for All MailTo',
  description: 'The Streets For All Members Club is an exclusive group for our most loyal supporters. Perks include unique stickers, t-shirts, hats and discounts with partners, having a say in the organization’s endorsements and special members-only events.',
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
