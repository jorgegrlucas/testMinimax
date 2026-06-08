import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-slate-600">Cette personne n'existe pas (ou plus).</p>
      <Button asChild className="mt-6">
        <Link href="/people">Retour à la liste</Link>
      </Button>
    </div>
  );
}
