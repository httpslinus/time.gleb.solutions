import clsx from "clsx";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Time is endless... until it isn't",
  description: "Time is endless... until it isn't",
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
          "h-full bg-white text-black dark:bg-neutral-950 dark:text-white",
        )}
      >
        {children}
      </body>
    </html>
  );
}
