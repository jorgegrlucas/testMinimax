import { z } from "zod";

export const PRESENCE_STATES = ["PRESENT", "ABSENT", "PARTIAL", "UNKNOWN"] as const;
export const CIVILITIES = ["MR", "MME", "MLLE"] as const;

const optionalString = z
  .string()
  .trim()
  .max(255)
  .optional()
  .transform((v) => (v === "" || v == null ? null : v));

const optionalDate = z
  .string()
  .optional()
  .transform((v) => (v ? v : null))
  .refine((v) => v === null || !isNaN(Date.parse(v)), {
    message: "Date invalide",
  })
  .transform((v) => (v ? new Date(v) : null));

export const personSchema = z.object({
  // Tech
  rpId: z.string().trim().min(1, "RP-ID requis").max(64),
  presenceState: z.enum(PRESENCE_STATES).default("UNKNOWN"),
  windowsLogin: optionalString,
  isServiceLead: z.boolean().default(false),
  hiddenInOrga: z.boolean().default(false),
  teamsException: z.boolean().default(false),

  // Pessoais
  civility: z.enum(CIVILITIES).optional().nullable(),
  lastName: z.string().trim().min(1, "Nom requis").max(128),
  firstName: z.string().trim().min(1, "Prénom requis").max(128),
  contractStart: optionalDate,
  physicalStart: optionalDate,
  isAbsent: z.boolean().default(false),
  absenceDisablesAd: z.boolean().default(false),

  // Coordenadas
  email: z
    .string()
    .trim()
    .email("Email invalide")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" || v == null ? null : v)),
  jobDescription: optionalString,
  employeeType: optionalString,
  company: optionalString,
  companyLabel: optionalString,
  service: optionalString,
  jobTitle: optionalString,
  managerId: optionalString,
  building: optionalString,
  workplace: optionalString,
});

export type PersonInput = z.infer<typeof personSchema>;
