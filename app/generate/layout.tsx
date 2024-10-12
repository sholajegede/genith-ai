import type { Metadata } from "next";
import { Navbar } from "../(root)/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://genith-ai.vercel.app/generate`
  : process.env.NODE_ENV === 'development'
  ? `http://localhost:3000/generate`
  : `https://genith-ai.vercel.app/generate`;

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Generate",
  description: "Generate stunning images and videos using AI."
};

export default function GenerateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        <Navbar />
        {children}
    </main>
  );
};