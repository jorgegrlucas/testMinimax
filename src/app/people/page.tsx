import Link from "next/link";
import { Plus } from "lucide-react";
import { listPeople, listServices, listManagers, type PersonListFilters } from "@/features/people/queries";
import { PersonFilters } from "@/features/people/components/PersonFilters";
import { PersonTable } from "@/features/people/components/PersonTable";
import { Button } from "@/shared/components/ui/button";

export const dynamic = "force-dynamic";

type SP = { [k: string]: string | string[] | undefined };

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const filters: PersonListFilters = {
    search: typeof sp.search === "string" ? sp.search : undefined,
    service: typeof sp.service === "string" ? sp.service : undefined,
    presence: typeof sp.presence === "string" ? sp.presence : undefined,
    managerId: typeof sp.managerId === "string" ? sp.managerId : undefined,
  };

  const [people, services, managers] = await Promise.all([
    listPeople(filters),
    listServices(),
    listManagers(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Personnes</h1>
          <p className="text-sm text-slate-600">
            Fiches d'identité — état actuel + historique des postes
          </p>
        </div>
        <Button asChild>
          <Link href="/people/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Nouvelle fiche
          </Link>
        </Button>
      </div>

      <PersonFilters services={services} managers={managers} />

      <PersonTable people={people} />
    </div>
  );
}
