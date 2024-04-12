import clsx from "clsx";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Time",
  creator: "https://linus.systems",
  publisher: "https://gleb.solutions",
  metadataBase: new URL("https://time.gleb.solutions"),
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon.png",
    },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
  ],
  openGraph: {
    type: "website",
    url: "https://time.gleb.solutions",
    title: "Time is endless... until it isn't",
    images: [
      {
        url: "https://time.gleb.solutions/og.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Time is endless... until it isn't",
    creator: "@httpslinus",
    images: "https://time.gleb.solutions/og.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={clsx(
          inter.className,
          "h-full bg-white text-black dark:bg-neutral-900 dark:text-white",
        )}
      >
        {children}
      </body>
    </html>
  );
}
