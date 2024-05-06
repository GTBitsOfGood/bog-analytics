import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import ContextProvider from "@/contexts/ContextProvider";

const inter = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bog Analytics Portal",
  description: "Analytics Manager UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ContextProvider>
        <body className={inter.className}>{children}</body>
      </ContextProvider>
    </html>
  );
}
