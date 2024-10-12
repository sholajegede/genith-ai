import { Navbar } from "./navbar";
export default function MarketingLayout({
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