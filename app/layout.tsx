import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Biology Vocabulary Trainer - Learn English-Burmese Biology Terms',
  description: 'A minimalist flashcard app to learn and practice biology vocabulary with Burmese definitions. Features customizable practice sessions, searchable vocabulary library, and progress tracking.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t border-gray-200 bg-gray-50 py-6 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-sm text-gray-600">
              © athena3140. All rights reserved.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
