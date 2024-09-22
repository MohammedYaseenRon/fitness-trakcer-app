import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Your Fitness App',
  description: 'Your personal fitness companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Providers>
      <body className={inter.className}>
            {children}
      </body>
      </Providers>
    </html>
  )
}