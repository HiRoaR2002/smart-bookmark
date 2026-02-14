import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Smart Bookmark - Organize Your Favorite Links",
    template: "%s | Smart Bookmark"
  },
  description: "Save, organize, and sync your favorite links in real-time. Secure bookmark manager with Google authentication. Access your bookmarks anywhere, anytime.",
  keywords: ["bookmarks", "bookmark manager", "link organizer", "save links", "web bookmarks", "bookmark sync", "real-time sync"],
  authors: [{ name: "Smart Bookmark Team" }],
  creator: "Smart Bookmark",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smart-bookmark-rouge.vercel.app",
    siteName: "Smart Bookmark",
    title: "Smart Bookmark - Organize Your Favorite Links",
    description: "Save, organize, and sync your favorite links in real-time. Secure bookmark manager with Google authentication.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Smart Bookmark App"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Bookmark - Organize Your Favorite Links",
    description: "Save, organize, and sync your favorite links in real-time.",
    images: ["/og-image.png"],
    creator: "@smartbookmark"
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
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366f1' },
    { media: '(prefers-color-scheme: dark)', color: '#6366f1' }
  ],
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
