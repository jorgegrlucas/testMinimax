import { notFound } from "next/navigation";
import { getPerson, listManagers } from "@/features/people/queries";
import { updatePerson } from "@/features/people/actions";
import { PersonForm } from "@/features/people/components/PersonForm";
import type { PersonInput } from "@/features/people/schemas";

export const dynamic = "force-dynamic";

function toDateInputValue(d: Date | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [person, managers] = await Promise.all([getPerson(id), listManagers()]);
  if (!person) notFound();

  const action = updatePerson.bind(null, id);

  // Build default values matching PersonInput shape
  const defaults: Partial<PersonInput> = {
    rpId: person.rpId,
    presenceState: person.presenceState as PersonInput["presenceState"],
    windowsLogin: person.windowsLogin ?? "",
    isServiceLead: person.isServiceLead,
    hiddenInOrga: person.hiddenInOrga,
    teamsException: person.teamsException,
    civility: (person.civility as PersonInput["civility"]) ?? undefined,
    lastName: person.lastName,
    firstName: person.firstName,
    contractStart: toDateInputValue(person.contractStart) as unknown as Date,
    physicalStart: toDateInputValue(person.physicalStart) as unknown as Date,
    isAbsent: person.isAbsent,
    absenceDisablesAd: person.absenceDisablesAd,
    email: person.email ?? "",
    jobDescription: person.jobDescription ?? "",
    employeeType: person.employeeType ?? "",
    company: person.company ?? "",
    companyLabel: person.companyLabel ?? "",
    service: person.service ?? "",
    jobTitle: person.jobTitle ?? "",
    managerId: person.managerId ?? "",
    building: person.building ?? "",
    workplace: person.workplace ?? "",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Modifier {person.firstName} {person.lastName}
        </h1>
        <p className="text-sm text-slate-600">
          Tout changement des champs de poste (service, fonction, manager, lieu…) crée automatiquement un nouvel enregistrement dans l'historique.
        </p>
      </div>
      <PersonForm
        action={action}
        managers={managers}
        defaultValues={defaults}
        submitLabel="Enregistrer les modifications"
        cancelHref={`/people/${id}`}
        personId={id}
      />
    </div>
  );
}
