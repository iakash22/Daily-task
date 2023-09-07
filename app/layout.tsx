import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Separator } from '@/components/ui/separator'
import NavBar from '@/components/NavBar'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Daily Task',
  description: 'Complete your daily task to create task collection',
  icons : {
    icon : [
      '/favicon.ico?v=4',
    ],
    apple : [
      '/apple-touch-icon.png?v=4',
    ],
    shortcut : [
      '/apple-touch-icon.png',
    ]
  },
  manifest : '/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en"
        className={cn(inter.className, "dark")} 
        style={{colorScheme : "dark",}}>
        <body>
          <ThemeProvider>
            <div 
              className='flex min-h-screen w-full flex-col items-center
                      dark:bg-black'
            >
              <NavBar />
              <Separator />
              <main 
                className='flex flex-grow w-full justify-center
                          items-center dark:bg-neutral-950'
              >
                {children}
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
