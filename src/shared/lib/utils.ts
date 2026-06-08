import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export const PRESENCE_LABELS: Record<string, string> = {
  PRESENT: "Présent",
  ABSENT: "Absent",
  PARTIAL: "Partiel",
  UNKNOWN: "Inconnu",
};

export const PRESENCE_COLORS: Record<string, string> = {
  PRESENT: "bg-emerald-100 text-emerald-800 border-emerald-200",
  ABSENT: "bg-rose-100 text-rose-800 border-rose-200",
  PARTIAL: "bg-amber-100 text-amber-800 border-amber-200",
  UNKNOWN: "bg-slate-100 text-slate-700 border-slate-200",
};

export const CIVILITY_LABELS: Record<string, string> = {
  MR: "M.",
  MME: "Mme",
  MLLE: "Mlle",
};
