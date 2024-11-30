import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Baseships v2 Demo",
  description: "Baseships v2 demo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
