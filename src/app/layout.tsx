import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Mono, Orbit, Rubik } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const IBMPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["700"],
});

const orbit = Orbit({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400"],
});

const rubik = Rubik({
  variable: "--font-main",
  subsets: ["latin"],
});


// metadata stuff

const baseUrl = process.env.NEXT_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL('https://nickrodi.com'),
  title: {
    default: 'nickrodi',
    template: '%s - nickrodi.com',
  },
  description: "Portfolio of Nick Rodi, a fourth-year Software Engineer student at ASU.",
  verification: {
  google: '',
  },

  openGraph: {
    title: 'Nick Rodi\'s portfolio and projects',
    description: 'Portfolio of Nick Rodi, a fourth-year Software Engineer student at ASU.',
    url: 'https://nickrodi.com',
    siteName: 'nickrodi',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/graph.png',
        width: 1200,
        height: 630,
        alt: 'nickrodi logo',
      },
    ]
  },
};

// google



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${IBMPlexMono.variable} ${orbit.variable} ${rubik.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
