"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personSchema, type PersonInput, PRESENCE_STATES, CIVILITIES } from "../schemas";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Button } from "@/shared/components/ui/button";
import { PRESENCE_LABELS, CIVILITY_LABELS } from "@/shared/lib/utils";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import type { ActionResult } from "../actions";

type Manager = { id: string; firstName: string; lastName: string; rpId: string };

type DefaultValues = Partial<PersonInput> & {
  contractStart?: string | Date | null;
  physicalStart?: string | Date | null;
};

export function PersonForm({
  action,
  managers,
  defaultValues,
  submitLabel = "Créer la fiche",
  cancelHref = "/people",
  personId,
}: {
  action: (
    prev: ActionResult | null,
    formData: FormData
  ) => Promise<ActionResult>;
  managers: Manager[];
  defaultValues?: DefaultValues;
  submitLabel?: string;
  cancelHref?: string;
  personId?: string;
}) {
  const [tab, setTab] = useState<"tech" | "perso" | "coords">("tech");
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  const form = useForm<PersonInput>({
    resolver: zodResolver(personSchema) as never,
    defaultValues: {
      rpId: "",
      presenceState: "UNKNOWN",
      windowsLogin: "",
      isServiceLead: false,
      hiddenInOrga: false,
      teamsException: false,
      civility: undefined,
      lastName: "",
      firstName: "",
      contractStart: null,
      physicalStart: null,
      isAbsent: false,
      absenceDisablesAd: false,
      email: "",
      jobDescription: "",
      employeeType: "",
      company: "",
      companyLabel: "",
      service: "",
      jobTitle: "",
      managerId: "",
      building: "",
      workplace: "",
      ...defaultValues,
    },
  });

  function onSubmit(values: PersonInput) {
    setServerError(null);
    setFieldErrors({});
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if (v instanceof Date) fd.append(k, v.toISOString());
      else fd.append(k, String(v));
    });
    // checkboxes precisam estar presentes (mesmo que false) para o server action detetar
    fd.set("isServiceLead", values.isServiceLead ? "on" : "");
    fd.set("hiddenInOrga", values.hiddenInOrga ? "on" : "");
    fd.set("teamsException", values.teamsException ? "on" : "");
    fd.set("isAbsent", values.isAbsent ? "on" : "");
    fd.set("absenceDisablesAd", values.absenceDisablesAd ? "on" : "");

    startTransition(async () => {
      const result = await action(null, fd);
      if (result && !result.ok) {
        setServerError(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
  }

  const tabs = [
    { id: "tech" as const, label: "Techniques" },
    { id: "perso" as const, label: "Personnelles" },
    { id: "coords" as const, label: "Coordonnées & poste" },
  ];

  const err = (k: string) => fieldErrors[k]?.[0];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            type="button"
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {serverError && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {serverError}
        </div>
      )}

      {tab === "tech" && (
        <div className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2">
          <div>
            <Label htmlFor="rpId">RP-ID *</Label>
            <Input id="rpId" {...form.register("rpId")} placeholder="RP-1234" />
            {err("rpId") && <p className="mt-1 text-xs text-rose-600">{err("rpId")}</p>}
          </div>
          <div>
            <Label htmlFor="presenceState">État de présence</Label>
            <Select id="presenceState" {...form.register("presenceState")}>
              {PRESENCE_STATES.map((s) => (
                <option key={s} value={s}>
                  {PRESENCE_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="windowsLogin">Login Windows</Label>
            <Input id="windowsLogin" {...form.register("windowsLogin")} placeholder="prenom.nom" />
          </div>

          <div className="md:col-span-2 grid gap-2 rounded-md border bg-slate-50 p-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("isServiceLead")} className="h-4 w-4" />
              <span>Responsable pour au moins un service actif</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("hiddenInOrga")} className="h-4 w-4" />
              <span>Masquer dans l'organigramme</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("teamsException")} className="h-4 w-4" />
              <span>Exception Teams</span>
            </label>
          </div>
        </div>
      )}

      {tab === "perso" && (
        <div className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2">
          <div>
            <Label htmlFor="civility">Civilité</Label>
            <Select id="civility" {...form.register("civility")}>
              <option value="">—</option>
              {CIVILITIES.map((c) => (
                <option key={c} value={c}>
                  {CIVILITY_LABELS[c]}
                </option>
              ))}
            </Select>
          </div>
          <div></div>
          <div>
            <Label htmlFor="lastName">Nom *</Label>
            <Input id="lastName" {...form.register("lastName")} />
            {err("lastName") && <p className="mt-1 text-xs text-rose-600">{err("lastName")}</p>}
          </div>
          <div>
            <Label htmlFor="firstName">Prénom *</Label>
            <Input id="firstName" {...form.register("firstName")} />
            {err("firstName") && <p className="mt-1 text-xs text-rose-600">{err("firstName")}</p>}
          </div>
          <div>
            <Label htmlFor="contractStart">Date de début de contrat</Label>
            <Input
              id="contractStart"
              type="date"
              {...form.register("contractStart")}
            />
          </div>
          <div>
            <Label htmlFor="physicalStart">Date d'entrée physique</Label>
            <Input
              id="physicalStart"
              type="date"
              {...form.register("physicalStart")}
            />
          </div>

          <div className="md:col-span-2 grid gap-2 rounded-md border bg-slate-50 p-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("isAbsent")} className="h-4 w-4" />
              <span>Absent.e</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register("absenceDisablesAd")} className="h-4 w-4" />
              <span>Absence avec désactivation de compte AD</span>
            </label>
          </div>
        </div>
      )}

      {tab === "coords" && (
        <div className="grid gap-4 rounded-lg border bg-white p-6 md:grid-cols-2">
          <div>
            <Label htmlFor="email">Email CALF</Label>
            <Input id="email" type="email" {...form.register("email")} placeholder="prenom.nom@calf.local" />
            {err("email") && <p className="mt-1 text-xs text-rose-600">{err("email")}</p>}
          </div>
          <div>
            <Label htmlFor="managerId">Responsable</Label>
            <Select id="managerId" {...form.register("managerId")}>
              <option value="">— Aucun —</option>
              {managers
                .filter((m) => m.id !== personId)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.firstName} {m.lastName} ({m.rpId})
                  </option>
                ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="jobDescription">Description du poste courant</Label>
            <Textarea id="jobDescription" {...form.register("jobDescription")} rows={2} />
          </div>
          <div>
            <Label htmlFor="employeeType">Type d'employé</Label>
            <Input id="employeeType" {...form.register("employeeType")} placeholder="Cadre, ETAM, Stagiaire…" />
          </div>
          <div>
            <Label htmlFor="company">Société</Label>
            <Input id="company" {...form.register("company")} />
          </div>
          <div>
            <Label htmlFor="companyLabel">Libellé société</Label>
            <Input id="companyLabel" {...form.register("companyLabel")} />
          </div>
          <div>
            <Label htmlFor="service">Service</Label>
            <Input id="service" {...form.register("service")} placeholder="DSI, Infra, DevOps…" />
          </div>
          <div>
            <Label htmlFor="jobTitle">Fonction</Label>
            <Input id="jobTitle" {...form.register("jobTitle")} />
          </div>
          <div>
            <Label htmlFor="building">Immeuble</Label>
            <Input id="building" {...form.register("building")} />
          </div>
          <div>
            <Label htmlFor="workplace">Lieu de travail</Label>
            <Input id="workplace" {...form.register("workplace")} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <Button asChild variant="ghost" type="button">
          <Link href={cancelHref}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Annuler
          </Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
