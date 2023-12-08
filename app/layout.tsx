import type { Metadata } from 'next';
import { Bitter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const bitter = Bitter({ subsets: ['latin'], weight: "400"});

export const metadata: Metadata = {
  title: 'Zenhire',
  description: 'Job Application Tracker and Visualizer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={bitter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
