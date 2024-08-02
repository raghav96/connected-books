import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/app/globals.css';
import { Header } from '@/components/header';
import { Providers } from '@/components/providers'
import ClientProvider from '@/components/ClientProvider';
import { cn } from '@/lib/utils'

export const metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'Connected Books',
    template: `%s - AI Chatbot that allows you to find books`,
  },
  description: 'An AI-powered chatbot that helps to find books that you are looking for. Click on a result to explore more books.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
      className={cn(
        'font-sans antialiased',
        GeistSans.variable,
        GeistMono.variable
      )}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
            <ClientProvider>
              {children}
            </ClientProvider>
          </Providers>
        </div>
      </body>
    </html>
  );
}
