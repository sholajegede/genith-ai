import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://genith-ai.vercel.app/dashboard`
  : process.env.NODE_ENV === 'development'
  ? `http://localhost:3000/dashboard`
  : `https://genith-ai.vercel.app/dashboard`;

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Dashboard",
  description: "Easily track your generated images, videos, and upvotes."
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
        {children}
    </main>
  );
};