import { listManagers } from "@/features/people/queries";
import { createPerson } from "@/features/people/actions";
import { PersonForm } from "@/features/people/components/PersonForm";

export const dynamic = "force-dynamic";

export default async function NewPersonPage() {
  const managers = await listManagers();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nouvelle fiche personne</h1>
        <p className="text-sm text-slate-600">
          Crée une nouvelle fiche d'identité — un premier enregistrement de poste sera créé automatiquement.
        </p>
      </div>
      <PersonForm action={createPerson} managers={managers} />
    </div>
  );
}
