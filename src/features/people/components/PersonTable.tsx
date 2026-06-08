import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { PRESENCE_LABELS, PRESENCE_COLORS, formatDate } from "@/shared/lib/utils";
import { ChevronRight, EyeOff, ShieldCheck, UserCheck } from "lucide-react";

type PersonRow = {
  id: string;
  rpId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  windowsLogin: string | null;
  presenceState: string;
  isServiceLead: boolean;
  hiddenInOrga: boolean;
  company: string | null;
  service: string | null;
  jobTitle: string | null;
  contractStart: Date | null;
  manager: { id: string; firstName: string; lastName: string } | null;
};

export function PersonTable({ people }: { people: PersonRow[] }) {
  if (people.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-12 text-center text-slate-500">
        <p className="text-lg">Aucune personne trouvée.</p>
        <p className="mt-1 text-sm">Essayez de modifier les filtres ou créez une nouvelle fiche.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RP-ID</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email / Login</TableHead>
            <TableHead>Société / Service</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Présence</TableHead>
            <TableHead>Début contrat</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((p) => (
            <TableRow key={p.id} className="group">
              <TableCell>
                <Link href={`/people/${p.id}`} className="font-mono text-xs text-blue-600 hover:underline">
                  {p.rpId}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="font-medium">
                    {p.lastName} {p.firstName}
                  </div>
                  <div className="flex gap-1">
                    {p.isServiceLead && (
                      <span title="Responsable de service">
                        <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                      </span>
                    )}
                    {p.hiddenInOrga && (
                      <span title="Masqué dans l'organigramme">
                        <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                      </span>
                    )}
                  </div>
                </div>
                {p.manager && (
                  <div className="text-xs text-slate-500">
                    → {p.manager.firstName} {p.manager.lastName}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">{p.email ?? "—"}</div>
                <div className="font-mono text-xs text-slate-500">{p.windowsLogin ?? "—"}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{p.company ?? "—"}</div>
                <div className="text-xs text-slate-500">{p.service ?? "—"}</div>
              </TableCell>
              <TableCell className="text-sm">{p.jobTitle ?? "—"}</TableCell>
              <TableCell>
                <Badge variant="outline" className={PRESENCE_COLORS[p.presenceState]}>
                  {PRESENCE_LABELS[p.presenceState] ?? p.presenceState}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {formatDate(p.contractStart)}
              </TableCell>
              <TableCell>
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/people/${p.id}`}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="border-t bg-slate-50 px-4 py-2 text-xs text-slate-600">
        {people.length} personne{people.length > 1 ? "s" : ""}
      </div>
    </div>
  );
}
