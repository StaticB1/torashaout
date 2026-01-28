import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'ToraShaout - Your Favorite Stars, Delivered Anywhere',
  description: 'Book personalized video messages from Zimbabwe\'s biggest celebrities. For birthdays, graduations, or just because.',
  keywords: ['celebrity', 'video', 'messages', 'zimbabwe', 'cameo', 'personalized'],
  authors: [{ name: 'ToraShaout' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://torashaout.com'),
  openGraph: {
    title: 'ToraShaout - Celebrity Video Messages',
    description: 'Book personalized video messages from Zimbabwe\'s biggest celebrities. For birthdays, graduations, or just because.',
    url: 'https://torashaout.com',
    siteName: 'ToraShaout',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToraShaout - Celebrity Video Messages',
    description: 'Book personalized video messages from Zimbabwe\'s biggest celebrities',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
