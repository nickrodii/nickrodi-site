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

export const metadata: Metadata = {
  title: "nickrodi",
  description: "Portfolio of Nick's projects, skills, and experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${IBMPlexMono.variable} ${orbit.variable} ${rubik.variable} antialiased`}>
        <header className="sticky top-0 z-50">
          <nav className="mx-auto max-w-[90rem] py-6">
            
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
