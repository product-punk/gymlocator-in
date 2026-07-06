import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@tabler/icons-webfont/dist/tabler-icons.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCities, getNavLocalities } from "@/lib/supabase/queries";

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
  description: 'Discover and compare gyms across India. Compare fees, timings, amenities and ratings - no signup needed.',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
    shortcut: '/favicon.png',
  },
};

// Only cities meeting the publishing threshold appear in navigation
const MIN_GYMS_FOR_NAV = 10

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cities, localitiesByCity] = await Promise.all([
    getCities(),
    getNavLocalities(4),
  ])

  const navCities = cities
    .filter((c: { gym_count: number }) => c.gym_count >= MIN_GYMS_FOR_NAV)
    .map((c: { name: string; slug: string; gym_count: number }) => ({
      name: c.name,
      slug: c.slug,
      gymCount: c.gym_count,
      localities: localitiesByCity[c.slug] ?? [],
    }))

  return (
    <html
      lang="en"
      className={`${inter.variable} dark h-full antialiased bg-base`}
    >
      <body className="min-h-full flex flex-col bg-base text-text font-sans">
        <Navbar cities={navCities} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
