import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToraShaout - Your Favorite Stars, Delivered Anywhere',
  description: 'Book personalized video messages from Zimbabwe\'s biggest celebrities. For birthdays, graduations, or just because.',
  keywords: ['celebrity', 'video', 'messages', 'zimbabwe', 'cameo', 'personalized'],
  authors: [{ name: 'ToraShaout' }],
  openGraph: {
    title: 'ToraShaout - Celebrity Video Messages',
    description: 'Book personalized video messages from Zimbabwe\'s biggest celebrities',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
