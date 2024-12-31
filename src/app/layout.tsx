import type { Metadata } from 'next'
import { Inter, Merriweather } from 'next/font/google'
import './globals.css'
import Provider from "../components/Provider/Provider"
import { ThemeProvider } from './providers'

const inter = Inter({ subsets: ["latin"] })
const merriweather = Merriweather({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Concept Mapper",
  description: "Create concept maps with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} ${merriweather.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </Provider>
  )
}
