import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const TITLE = "Furnex - Full stack e-commerce project.";
const DESCRIPTION =
  "Furnex is a full‑stack e‑commerce web application built with modern web technologies. It supports user authentication, product browsing with advanced filtering, cart and order management, and an admin dashboard for managing products and orders.";
const NAME = "Md Shakerullah Sourov";

export const metadata = {
  metadataBase: new URL(BASE_URL),

  title: TITLE,
  description: DESCRIPTION,

  alternates: {
    canonical: BASE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    creator: "@mdshakerullahS",
    images: ["/og-image.png"],
    description: DESCRIPTION,
    title: TITLE,
  },

  icons: {
    icon: "/favicon.ico",
    // apple: "/apple-touch-icon.png",
  },

  creator: NAME,

  publisher: NAME,
};

export const viewport = {
  themeColor: "#b88e2f",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
