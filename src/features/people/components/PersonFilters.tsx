"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Search, X } from "lucide-react";

const PRESENCE_OPTIONS = [
  { value: "ALL", label: "Tous les états" },
  { value: "PRESENT", label: "Présent" },
  { value: "ABSENT", label: "Absent" },
  { value: "PARTIAL", label: "Partiel" },
  { value: "UNKNOWN", label: "Inconnu" },
];

export function PersonFilters({
  services,
  managers,
}: {
  services: string[];
  managers: { id: string; firstName: string; lastName: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const current = {
    search: params.get("search") ?? "",
    service: params.get("service") ?? "ALL",
    presence: params.get("presence") ?? "ALL",
    managerId: params.get("managerId") ?? "ALL",
  };

  function update(name: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "ALL") next.set(name, value);
    else next.delete(name);
    startTransition(() => {
      router.replace(`/people?${next.toString()}`);
    });
  }

  function clearAll() {
    startTransition(() => router.replace("/people"));
  }

  const hasFilters = current.search || current.service !== "ALL" || current.presence !== "ALL" || current.managerId !== "ALL";

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-white p-4">
      <div className="flex-1 min-w-[200px]">
        <label className="mb-1.5 block text-xs font-medium text-slate-600">Recherche</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Nom, RP-ID, email, login…"
            className="pl-9"
            defaultValue={current.search}
            onChange={(e) => update("search", e.target.value)}
          />
        </div>
      </div>

      <div className="min-w-[180px]">
        <label className="mb-1.5 block text-xs font-medium text-slate-600">Service</label>
        <Select value={current.service} onChange={(e) => update("service", e.target.value)}>
          <option value="ALL">Tous les services</option>
          {services.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="min-w-[160px]">
        <label className="mb-1.5 block text-xs font-medium text-slate-600">État de présence</label>
        <Select value={current.presence} onChange={(e) => update("presence", e.target.value)}>
          {PRESENCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="min-w-[200px]">
        <label className="mb-1.5 block text-xs font-medium text-slate-600">Responsable</label>
        <Select value={current.managerId} onChange={(e) => update("managerId", e.target.value)}>
          <option value="ALL">Tous les responsables</option>
          {managers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.lastName} {m.firstName}
            </option>
          ))}
        </Select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} disabled={isPending}>
          <X className="mr-1 h-4 w-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
