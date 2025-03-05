import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

// Google Tag Manager和Analytics IDs
const GTM_ID = 'GTM-MN7WSP2Q';
const GA_ID = 'G-NN0PPJW172';

export const metadata: Metadata = {
  title: 'Free Emoji Translator & Text to Emoji Converter | EmojiTell',
  description: 'Transform your plain text into expressive emoji messages with EmojiTell. Our free multilingual emoji translator creates emoji combos, emojifies text, or adds line emojis in English, Spanish, French and more.',
  metadataBase: new URL('https://emojitell.com'),
  keywords: 'emoji translator, text to emoji, emoji converter, emoji combos, emojify text, line-by-line emoji style, social media emoji, chrome extension, free emoji translator, multilingual emoji converter, xiaohongshu style, red book style',
  authors: [{ name: 'EmojiTell' }],
  creator: 'EmojiTell',
  openGraph: {
    title: 'Free Emoji Translator & Text to Emoji Converter | EmojiTell',
    description: 'Transform plain text into expressive emoji messages with our free multilingual emoji converter and Chrome extension. Support for English, Spanish, French, Chinese and more.',
    url: 'https://emojitell.com/',
    type: 'website',
    images: [
      {
        url: 'https://emojitell.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EmojiTell - Free Emoji Translator',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Emoji Translator & Text to Emoji Converter | EmojiTell',
    description: 'Transform plain text into expressive emoji messages with our free multilingual emoji converter and Chrome extension',
    images: ['https://emojitell.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://emojitell.com/',
    languages: {
      'en-US': 'https://emojitell.com/',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-id', // 请替换为您的Google Search Console验证ID
    other: {
      'google-analytics': GA_ID,
      'google-tag-manager': GTM_ID,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-4">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
        
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script
          id="ga-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { 'send_page_view': true });
            `,
          }}
        />
      </body>
    </html>
  );
}