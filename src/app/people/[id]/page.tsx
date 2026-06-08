import { notFound } from "next/navigation";
import Link from "next/link";
import { getPerson } from "@/features/people/queries";
import { deletePerson } from "@/features/people/actions";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { RecordTimeline } from "@/features/people/components/RecordTimeline";
import { formatDate, PRESENCE_LABELS, PRESENCE_COLORS, CIVILITY_LABELS } from "@/shared/lib/utils";
import { Pencil, Trash2, ArrowLeft, Mail, AtSign, UserCheck, EyeOff, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  async function handleDelete() {
    "use server";
    await deletePerson(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
            <Link href="/people">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Retour à la liste
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">
            {CIVILITY_LABELS[person.civility ?? ""] ?? ""} {person.firstName} {person.lastName}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-mono text-xs text-slate-500">{person.rpId}</span>
            <Badge variant="outline" className={PRESENCE_COLORS[person.presenceState]}>
              {PRESENCE_LABELS[person.presenceState] ?? person.presenceState}
            </Badge>
            {person.isServiceLead && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-700">
                <UserCheck className="h-3.5 w-3.5" /> Responsable
              </span>
            )}
            {person.hiddenInOrga && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <EyeOff className="h-3.5 w-3.5" /> Masqué
              </span>
            )}
            {person.isAbsent && (
              <span className="inline-flex items-center gap-1 text-xs text-rose-700">
                <AlertTriangle className="h-3.5 w-3.5" /> Absent
                {person.absenceDisablesAd && " · AD désactivé"}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/people/${id}/edit`}>
              <Pencil className="mr-1.5 h-4 w-4" />
              Modifier
            </Link>
          </Button>
          <form action={handleDelete}>
            <Button type="submit" variant="destructive">
              <Trash2 className="mr-1.5 h-4 w-4" />
              Supprimer
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Coluna esquerda: estado atual */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Coordonnées & poste actuel</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Field label="Email CALF" value={
                person.email ? (
                  <a className="inline-flex items-center gap-1 text-blue-600 hover:underline" href={`mailto:${person.email}`}>
                    <Mail className="h-3.5 w-3.5" />{person.email}
                  </a>
                ) : "—"
              } />
              <Field label="Login Windows" value={
                person.windowsLogin ? (
                  <span className="inline-flex items-center gap-1 font-mono text-xs">
                    <AtSign className="h-3.5 w-3.5" />{person.windowsLogin}
                  </span>
                ) : "—"
              } />
              <Field label="Poste" value={person.jobTitle} />
              <Field label="Type d'employé" value={person.employeeType} />
              <Field label="Société" value={person.company} />
              <Field label="Libellé société" value={person.companyLabel} />
              <Field label="Service" value={person.service} />
              <Field label="Immeuble" value={person.building} />
              <Field label="Lieu de travail" value={person.workplace} />
              <Field label="Responsable" value={
                person.manager ? (
                  <Link href={`/people/${person.manager.id}`} className="text-blue-600 hover:underline">
                    {person.manager.firstName} {person.manager.lastName}
                  </Link>
                ) : "—"
              } />
              {person.jobDescription && (
                <div className="col-span-2">
                  <p className="text-xs font-medium text-slate-500">Description du poste</p>
                  <p className="mt-1 text-sm">{person.jobDescription}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Field label="Date de début de contrat" value={formatDate(person.contractStart)} />
              <Field label="Date d'entrée physique" value={formatDate(person.physicalStart)} />
              <Field label="Créé le" value={formatDate(person.createdAt)} />
              <Field label="Mis à jour" value={formatDate(person.updatedAt)} />
            </CardContent>
          </Card>
        </div>

        {/* Coluna direita: histórico */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historique des postes</CardTitle>
              <p className="text-xs text-slate-500">
                Chaque changement significatif (service, fonction, manager, lieu…) crée un nouvel enregistrement.
              </p>
            </CardHeader>
            <CardContent>
              <RecordTimeline records={person.records} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <div className="mt-0.5">{value || "—"}</div>
    </div>
  );
}
