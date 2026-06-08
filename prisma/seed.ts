import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpar dados existentes
  await prisma.personRecord.deleteMany();
  await prisma.person.deleteMany();

  // Manager topo
  const alice = await prisma.person.create({
    data: {
      rpId: "RP-0001",
      presenceState: "PRESENT",
      windowsLogin: "alice.morel",
      isServiceLead: true,
      hiddenInOrga: false,
      teamsException: false,
      civility: "MME",
      lastName: "Morel",
      firstName: "Alice",
      contractStart: new Date("2018-03-15"),
      physicalStart: new Date("2018-04-01"),
      isAbsent: false,
      email: "alice.morel@calf.local",
      jobDescription: "Directrice des Systèmes d'Information",
      employeeType: "Cadre",
      company: "CALF",
      companyLabel: "Compagnie d'Assurances Locale Française",
      service: "DSI",
      jobTitle: "DSI",
      building: "Siège - Tour A",
      workplace: "Paris",
    },
  });

  // Manager intermédiaire (reporta à Alice)
  const bob = await prisma.person.create({
    data: {
      rpId: "RP-0002",
      presenceState: "PRESENT",
      windowsLogin: "bob.dupont",
      isServiceLead: true,
      civility: "MR",
      lastName: "Dupont",
      firstName: "Bob",
      contractStart: new Date("2019-09-01"),
      physicalStart: new Date("2019-09-15"),
      email: "bob.dupont@calf.local",
      jobDescription: "Responsable Infrastructure & Production",
      employeeType: "Cadre",
      company: "CALF",
      companyLabel: "CALF",
      service: "Infra",
      jobTitle: "Responsable Infra",
      building: "Siège - Tour A",
      workplace: "Paris",
      managerId: alice.id,
    },
  });

  // Tech lead (reporta a Bob)
  const clara = await prisma.person.create({
    data: {
      rpId: "RP-0003",
      presenceState: "PARTIAL",
      windowsLogin: "clara.fontaine",
      isServiceLead: false,
      civility: "MME",
      lastName: "Fontaine",
      firstName: "Clara",
      contractStart: new Date("2020-02-10"),
      physicalStart: new Date("2020-03-02"),
      isAbsent: false,
      email: "clara.fontaine@calf.local",
      jobDescription: "Tech Lead DevOps",
      employeeType: "Cadre",
      company: "CALF",
      service: "DevOps",
      jobTitle: "Tech Lead",
      building: "Siège - Tour B",
      workplace: "Paris",
      managerId: bob.id,
    },
  });

  // Développeur (reporta a Clara)
  const dylan = await prisma.person.create({
    data: {
      rpId: "RP-0004",
      presenceState: "PRESENT",
      windowsLogin: "dylan.renard",
      civility: "MR",
      lastName: "Renard",
      firstName: "Dylan",
      contractStart: new Date("2022-06-01"),
      physicalStart: new Date("2022-06-15"),
      email: "dylan.renard@calf.local",
      jobDescription: "Développeur Full-Stack",
      employeeType: "ETAM",
      company: "CALF",
      service: "DevOps",
      jobTitle: "Développeur",
      building: "Siège - Tour B",
      workplace: "Paris",
      managerId: clara.id,
    },
  });

  // Pessoa ausente (exemplo isAbsent)
  const elsa = await prisma.person.create({
    data: {
      rpId: "RP-0005",
      presenceState: "ABSENT",
      windowsLogin: "elsa.vidal",
      isServiceLead: false,
      hiddenInOrga: true,
      civility: "MME",
      lastName: "Vidal",
      firstName: "Elsa",
      contractStart: new Date("2017-11-20"),
      physicalStart: new Date("2017-12-04"),
      isAbsent: true,
      absenceDisablesAd: true,
      email: "elsa.vidal@calf.local",
      jobDescription: "Cheffe de projet MOA",
      employeeType: "Cadre",
      company: "CALF",
      service: "MOA",
      jobTitle: "Cheffe de projet",
      building: "Siège - Tour A",
      workplace: "Lyon",
      managerId: alice.id,
    },
  });

  // Estagiário (mais recente)
  const felix = await prisma.person.create({
    data: {
      rpId: "RP-0006",
      presenceState: "PRESENT",
      windowsLogin: "felix.barbier",
      civility: "MR",
      lastName: "Barbier",
      firstName: "Félix",
      contractStart: new Date("2024-01-08"),
      physicalStart: new Date("2024-01-15"),
      email: "felix.barbier@calf.local",
      jobDescription: "Stagiaire développeur",
      employeeType: "Stagiaire",
      company: "CALF",
      service: "DevOps",
      jobTitle: "Stagiaire",
      building: "Siège - Tour B",
      workplace: "Paris",
      managerId: clara.id,
    },
  });

  // Historique de postos — Elsa mudou de service em 2021
  await prisma.personRecord.createMany({
    data: [
      {
        personId: bob.id,
        positionStart: new Date("2019-09-15"),
        contractType: "CDI",
        employeeType: "Cadre",
        classification: "Cadre",
        company: "CALF",
        service: "Infra",
        jobTitle: "Ingénieur Infra",
        positionEnd: new Date("2022-01-01"),
        building: "Siège - Tour A",
        workplace: "Paris",
      },
      {
        personId: bob.id,
        positionStart: new Date("2022-01-01"),
        contractType: "CDI",
        employeeType: "Cadre",
        classification: "Cadre",
        company: "CALF",
        service: "Infra",
        jobTitle: "Responsable Infra",
        // null = posto atual
        building: "Siège - Tour A",
        workplace: "Paris",
      },
      {
        personId: clara.id,
        positionStart: new Date("2020-03-02"),
        contractType: "CDI",
        employeeType: "Cadre",
        company: "CALF",
        service: "DevOps",
        jobTitle: "Tech Lead DevOps",
        certifiedEmp: true,
        mandatoryCert: "AWS Solutions Architect",
        building: "Siège - Tour B",
        workplace: "Paris",
      },
      {
        personId: elsa.id,
        positionStart: new Date("2017-12-04"),
        contractType: "CDI",
        employeeType: "Cadre",
        company: "CALF",
        service: "Infra",
        jobTitle: "Ingénieur Réseau",
        positionEnd: new Date("2021-05-01"),
        building: "Siège - Tour A",
        workplace: "Paris",
      },
      {
        personId: elsa.id,
        positionStart: new Date("2021-05-01"),
        contractType: "CDI",
        employeeType: "Cadre",
        company: "CALF",
        service: "MOA",
        jobTitle: "Cheffe de projet",
        building: "Siège - Tour A",
        workplace: "Lyon",
      },
    ],
  });

  console.log(`✅ Seed concluído: 6 pessoas + 5 registos de histórico`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
