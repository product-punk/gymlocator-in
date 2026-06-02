import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@tabler/icons-webfont/dist/tabler-icons.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: 'Find Best Gyms in India | Gymlocator.in',
    template: '%s | Gymlocator.in',
  },
  description: 'Discover and compare gyms across India. Compare fees, timings, amenities and ratings — no signup needed.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark h-full antialiased bg-base`}
    >
      <body className="min-h-full flex flex-col bg-base text-text-primary font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
