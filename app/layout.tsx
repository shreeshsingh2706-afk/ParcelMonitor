import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "OrderHub — All Your Orders, One Dashboard",
  description:
    "Track Amazon, Flipkart, Myntra, Ajio, and Meesho orders in one unified, premium dashboard.",
  keywords: "order tracking, Amazon, Flipkart, Myntra, package tracking, delivery",
  openGraph: {
    title: "OrderHub — Unified Order Tracking",
    description: "Track all your online orders in one premium dashboard.",
    type: "website",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#050816", color: "#FFFFFF" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
