import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// フォントを CSS 変数（--font-geist-sans など）として使えるようにする設定
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// フォントを CSS 変数（--font-geist-sans など）として使えるようにする設定
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFC チェックイン",
  description: "NFCタグを使用したチェックインシステム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
