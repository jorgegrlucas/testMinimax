import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export type PersonListFilters = {
  search?: string;
  service?: string;
  presence?: string;
  managerId?: string;
};

export async function listPeople(filters: PersonListFilters = {}) {
  const where: Prisma.PersonWhereInput = {};

  if (filters.search) {
    const q = filters.search.trim();
    where.OR = [
      { firstName: { contains: q } },
      { lastName: { contains: q } },
      { rpId: { contains: q } },
      { email: { contains: q } },
      { windowsLogin: { contains: q } },
    ];
  }

  if (filters.service && filters.service !== "ALL") {
    where.service = filters.service;
  }

  if (filters.presence && filters.presence !== "ALL") {
    where.presenceState = filters.presence;
  }

  if (filters.managerId && filters.managerId !== "ALL") {
    where.managerId = filters.managerId;
  }

  const people = await prisma.person.findMany({
    where,
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: {
      manager: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  return people;
}

export async function getPerson(id: string) {
  return prisma.person.findUnique({
    where: { id },
    include: {
      manager: { select: { id: true, firstName: true, lastName: true, rpId: true } },
      records: {
        orderBy: { positionStart: "desc" },
      },
    },
  });
}

export async function listServices() {
  const rows = await prisma.person.findMany({
    where: { service: { not: null } },
    select: { service: true },
    distinct: ["service"],
    orderBy: { service: "asc" },
  });
  return rows.map((r) => r.service!).filter(Boolean);
}

export async function listManagers() {
  return prisma.person.findMany({
    where: { isServiceLead: true },
    select: { id: true, firstName: true, lastName: true, rpId: true },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}
