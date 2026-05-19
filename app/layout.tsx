import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sri Murugan Coconut Wholesale",
  description:
    "Daily coconut rates, wholesale coconut ordering, oil ordering, delivery and pickup for Sri Murugan Coconut Wholesale.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Sri Murugan Coconut Wholesale",
    description: "Order coconuts and oils by count, kilogram, or litre.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
