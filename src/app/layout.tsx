import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Users, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "People Manager",
  description: "Gestion de fiches personnes — style Netwrix Identity Manager",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="container flex h-16 items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <Users className="h-6 w-6 text-blue-600" />
              <span>People Manager</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/people"
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
              >
                <FileText className="mr-1.5 inline h-4 w-4" />
                Personnes
              </Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
