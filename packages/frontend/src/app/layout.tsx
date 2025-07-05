import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import './globals.css';

import { Providers } from '@/components/providers/Providers';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrendSniper - Análise de Tendências de Criativos',
  description: 'Plataforma SaaS para extração, análise e exibição de tendências de criativos da Meta Ads Library',
  keywords: ['facebook ads', 'instagram ads', 'criativos', 'tendências', 'marketing', 'tráfego pago'],
  authors: [{ name: 'TrendSniper Team' }],
  creator: 'TrendSniper',
  publisher: 'TrendSniper',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://trendsniper.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'TrendSniper',
    title: 'TrendSniper - Análise de Tendências de Criativos',
    description: 'Plataforma SaaS para extração, análise e exibição de tendências de criativos da Meta Ads Library',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TrendSniper - Análise de Tendências de Criativos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrendSniper - Análise de Tendências de Criativos',
    description: 'Plataforma SaaS para extração, análise e exibição de tendências de criativos da Meta Ads Library',
    images: ['/og-image.png'],
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}