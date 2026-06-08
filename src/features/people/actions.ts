"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/server/db";
import { personSchema, type PersonInput } from "./schemas";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function formatZodErrors(err: unknown): { error: string; fieldErrors: Record<string, string[]> } {
  if (err && typeof err === "object" && "issues" in err) {
    const issues = (err as { issues: { path: (string | number)[]; message: string }[] }).issues;
    const fieldErrors: Record<string, string[]> = {};
    for (const i of issues) {
      const key = i.path.join(".") || "_";
      (fieldErrors[key] ??= []).push(i.message);
    }
    return {
      error: "Veuillez corriger les erreurs du formulaire.",
      fieldErrors,
    };
  }
  return { error: "Erreur inconnue", fieldErrors: {} };
}

export async function createPerson(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
  // checkboxes: presença como "on" ou ausente
  raw.isServiceLead = formData.get("isServiceLead") === "on";
  raw.hiddenInOrga = formData.get("hiddenInOrga") === "on";
  raw.teamsException = formData.get("teamsException") === "on";
  raw.isAbsent = formData.get("isAbsent") === "on";
  raw.absenceDisablesAd = formData.get("absenceDisablesAd") === "on";

  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, ...formatZodErrors(parsed.error) };
  }

  const data = parsed.data;

  try {
    const person = await prisma.person.create({
      data: {
        rpId: data.rpId,
        presenceState: data.presenceState,
        windowsLogin: data.windowsLogin ?? null,
        isServiceLead: data.isServiceLead,
        hiddenInOrga: data.hiddenInOrga,
        teamsException: data.teamsException,
        civility: data.civility ?? null,
        lastName: data.lastName,
        firstName: data.firstName,
        contractStart: data.contractStart ?? null,
        physicalStart: data.physicalStart ?? null,
        isAbsent: data.isAbsent,
        absenceDisablesAd: data.absenceDisablesAd,
        email: data.email ?? null,
        jobDescription: data.jobDescription ?? null,
        employeeType: data.employeeType ?? null,
        company: data.company ?? null,
        companyLabel: data.companyLabel ?? null,
        service: data.service ?? null,
        jobTitle: data.jobTitle ?? null,
        managerId: data.managerId && data.managerId !== "" ? data.managerId : null,
        building: data.building ?? null,
        workplace: data.workplace ?? null,
        records: {
          create: {
            // Cria o PersonRecord inicial com a posição atual
            positionStart: data.contractStart ?? new Date(),
            employeeType: data.employeeType ?? null,
            jobDescription: data.jobDescription ?? null,
            company: data.company ?? null,
            service: data.service ?? null,
            jobTitle: data.jobTitle ?? null,
            managerId: data.managerId && data.managerId !== "" ? data.managerId : null,
            building: data.building ?? null,
            workplace: data.workplace ?? null,
          },
        },
      },
    });

    revalidatePath("/people");
    redirect(`/people/${person.id}`);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") {
      return {
        ok: false,
        error: "RP-ID ou email/login Windows já existe.",
      };
    }
    throw e;
  }
  // unreachable
  return { ok: false, error: "Erreur" };
}

export async function updatePerson(
  id: string,
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
  raw.isServiceLead = formData.get("isServiceLead") === "on";
  raw.hiddenInOrga = formData.get("hiddenInOrga") === "on";
  raw.teamsException = formData.get("teamsException") === "on";
  raw.isAbsent = formData.get("isAbsent") === "on";
  raw.absenceDisablesAd = formData.get("absenceDisablesAd") === "on";

  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, ...formatZodErrors(parsed.error) };
  }

  const data = parsed.data;
  const previous = await prisma.person.findUnique({
    where: { id },
    select: {
      employeeType: true,
      jobDescription: true,
      company: true,
      service: true,
      jobTitle: true,
      managerId: true,
      building: true,
      workplace: true,
    },
  });
  if (!previous) return { ok: false, error: "Personne introuvable" };

  // Detetar mudança de "posição" (campos que pertencem à ficha de poste)
  const positionFields: (keyof typeof previous)[] = [
    "employeeType",
    "jobDescription",
    "company",
    "service",
    "jobTitle",
    "managerId",
    "building",
    "workplace",
  ];
  const positionChanged = positionFields.some(
    (k) => (previous[k] ?? null) !== (data[k as keyof PersonInput] ?? null)
  );

  try {
    await prisma.$transaction(async (tx) => {
      await tx.person.update({
        where: { id },
        data: {
          rpId: data.rpId,
          presenceState: data.presenceState,
          windowsLogin: data.windowsLogin ?? null,
          isServiceLead: data.isServiceLead,
          hiddenInOrga: data.hiddenInOrga,
          teamsException: data.teamsException,
          civility: data.civility ?? null,
          lastName: data.lastName,
          firstName: data.firstName,
          contractStart: data.contractStart ?? null,
          physicalStart: data.physicalStart ?? null,
          isAbsent: data.isAbsent,
          absenceDisablesAd: data.absenceDisablesAd,
          email: data.email ?? null,
          jobDescription: data.jobDescription ?? null,
          employeeType: data.employeeType ?? null,
          company: data.company ?? null,
          companyLabel: data.companyLabel ?? null,
          service: data.service ?? null,
          jobTitle: data.jobTitle ?? null,
          managerId: data.managerId && data.managerId !== "" ? data.managerId : null,
          building: data.building ?? null,
          workplace: data.workplace ?? null,
        },
      });

      if (positionChanged) {
        // Fecha o record atual
        await tx.personRecord.updateMany({
          where: { personId: id, positionEnd: null },
          data: { positionEnd: new Date() },
        });
        // Cria novo
        await tx.personRecord.create({
          data: {
            personId: id,
            positionStart: new Date(),
            employeeType: data.employeeType ?? null,
            jobDescription: data.jobDescription ?? null,
            company: data.company ?? null,
            service: data.service ?? null,
            jobTitle: data.jobTitle ?? null,
            managerId: data.managerId && data.managerId !== "" ? data.managerId : null,
            building: data.building ?? null,
            workplace: data.workplace ?? null,
          },
        });
      }
    });

    revalidatePath("/people");
    revalidatePath(`/people/${id}`);
    redirect(`/people/${id}`);
  } catch (e) {
    if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2002") {
      return {
        ok: false,
        error: "RP-ID ou email/login Windows déjà utilisé.",
      };
    }
    throw e;
  }
  return { ok: false, error: "Erreur" };
}

export async function deletePerson(id: string): Promise<void> {
  await prisma.person.delete({ where: { id } });
  revalidatePath("/people");
  redirect("/people");
}
