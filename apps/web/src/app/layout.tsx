import type { Metadata } from "next";
import "./globals.css";
import { CultureProvider } from "@/context/CultureContext";
import ThemedContent from "@/components/ThemedContent";

export const metadata: Metadata = {
  title: "PERMATA",
  description:
    "Platform integrasi pendidikan resiliensi mental untuk pertumbuhan pasca-trauma berbasis kearifan lokal Nusantara.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-culture="aceh" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <CultureProvider>
          <ThemedContent>{children}</ThemedContent>
        </CultureProvider>
      </body>
    </html>
  );
}
