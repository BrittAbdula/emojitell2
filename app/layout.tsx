import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EmojiTell - Emoji Translator & Text to Emoji Converter',
  description: 'Transform your plain text into expressive emoji messages with EmojiTell. Create emoji combos, emojify text, or add line emojis with our free online converter and Chrome extension.',
  metadataBase: new URL('https://emojitell.com'),
  keywords: 'emoji translator, text to emoji, emoji converter, emoji combos, emojify text, line-by-line emoji style, social media emoji, chrome extension',
  authors: [{ name: 'EmojiTell' }],
  creator: 'EmojiTell',
  openGraph: {
    title: 'EmojiTell - Emoji Translator & Text to Emoji Converter',
    description: 'Transform plain text into expressive emoji messages with our free online converter and Chrome extension',
    url: 'https://emojitell.com/',
    type: 'website',
  },
  alternates: {
    canonical: 'https://emojitell.com/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}