import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js Name Manager",
  description: "Manage and generate names with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
          <Link href="/">Home</Link> | 
          <Link href="/inputName"> Input Name</Link> | 
          <Link href="/listStoredNames"> Stored Names</Link> | 
          <Link href="/generateNames"> Generate Names</Link>
        </nav>
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
