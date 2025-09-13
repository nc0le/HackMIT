import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learning App API',
  description: 'Next.js + Supabase backend for learning management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
