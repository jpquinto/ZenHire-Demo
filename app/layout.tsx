import type { Metadata } from 'next';
import { Bitter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider';

const bitter = Bitter({ subsets: ['latin'], weight: "400"});

export const metadata: Metadata = {
  title: 'Job Application Tracker',
  description: 'Job Application Tracker and Visualizer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={bitter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
