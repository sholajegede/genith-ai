import type { Metadata } from "next";
import { Navbar } from "../(root)/navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://genith-ai.vercel.app/pricing`
  : process.env.NODE_ENV === 'development'
  ? `http://localhost:3000/pricing`
  : `https://genith-ai.vercel.app/pricing`;

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Pricing",
  description: "Get more credits to generate as many images and videos as you want."
};

export default function PricingLayout({
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