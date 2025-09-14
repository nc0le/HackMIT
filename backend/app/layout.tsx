import { Metadata } from 'next'
import './globals.css'
import Navigation from './components/Navigation'
import { UserProvider } from './contexts/UserContext'

export const metadata: Metadata = {
  title: 'Learning App',
  description: 'A comprehensive learning platform with coding exercises and progress tracking',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{backgroundColor: '#FFFFE7'}}>
        {/* Grid Background Overlay */}
        <div
          className="fixed inset-0 pointer-events-none opacity-20 z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
        <div className="relative z-10">
          <UserProvider>
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
          </UserProvider>
        </div>
      </body>
    </html>
  )
}