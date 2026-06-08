import { formatDate } from "@/shared/lib/utils";
import { Briefcase, Calendar, Building2, MapPin, CheckCircle2 } from "lucide-react";

type Record = {
  id: string;
  positionStart: Date;
  positionEnd: Date | null;
  jobTitle: string | null;
  service: string | null;
  company: string | null;
  building: string | null;
  workplace: string | null;
  jobDescription: string | null;
  contractType: string | null;
  certifiedEmp: boolean;
  mandatoryCert: string | null;
};

export function RecordTimeline({ records }: { records: Record[] }) {
  if (records.length === 0) {
    return (
      <p className="rounded-md border bg-slate-50 p-4 text-sm text-slate-500">
        Aucun historique de poste enregistré.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6">
      {records.map((r, idx) => {
        const isCurrent = !r.positionEnd;
        return (
          <li key={r.id} className="relative">
            <span
              className={`absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                isCurrent ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <Briefcase className="h-3 w-3 text-white" />
            </span>
            <div
              className={`rounded-lg border p-4 ${
                isCurrent ? "border-emerald-200 bg-emerald-50/50" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">
                      {r.jobTitle ?? "—"}
                    </h4>
                    {isCurrent && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        En cours
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {r.service ?? "—"} {r.company ? `· ${r.company}` : ""}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {[r.building, r.workplace].filter(Boolean).join(" · ") || "—"}
                    </span>
                    {r.contractType && (
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {r.contractType}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>{formatDate(r.positionStart)}</div>
                  <div className="text-slate-400">
                    → {r.positionEnd ? formatDate(r.positionEnd) : "aujourd'hui"}
                  </div>
                </div>
              </div>

              {r.jobDescription && (
                <p className="mt-2 text-sm text-slate-700">{r.jobDescription}</p>
              )}

              {r.certifiedEmp && (
                <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Collaborateur certifié{r.mandatoryCert ? ` · ${r.mandatoryCert}` : ""}
                </div>
              )}

              {idx === 0 && !isCurrent && (
                <div className="mt-2 text-xs italic text-slate-500">Fiche de poste la plus récente</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
