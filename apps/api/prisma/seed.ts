import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const roles = [
    { code: 'CHILD', name: 'Child' },
    { code: 'PARENT_GUARDIAN', name: 'Parent/Guardian' },
    { code: 'TEACHER_COUNSELOR', name: 'Teacher/Counselor' },
    { code: 'VOLUNTEER', name: 'Volunteer' },
    { code: 'PROFESSIONAL', name: 'Professional' },
    { code: 'AUTHORIZED_OFFICER', name: 'Authorized Officer' },
    { code: 'PROGRAM_MANAGER', name: 'Program Manager' },
    { code: 'CONTENT_ADMIN', name: 'Content Admin' },
    { code: 'SUPER_ADMIN', name: 'Super Admin' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
  }

  const disasterTypes = [
    { code: 'EARTHQUAKE', name: 'Gempa Bumi', nameEn: 'Earthquake' },
    { code: 'FLOOD', name: 'Banjir', nameEn: 'Flood' },
    { code: 'VOLCANIC_ERUPTION', name: 'Erupsi Gunung Berapi', nameEn: 'Volcanic Eruption' },
    { code: 'TSUNAMI', name: 'Tsunami', nameEn: 'Tsunami' },
    { code: 'LANDSLIDE', name: 'Tanah Longsor', nameEn: 'Landslide' },
    { code: 'FIRE', name: 'Kebakaran', nameEn: 'Fire' },
    { code: 'DROUGHT', name: 'Kekeringan', nameEn: 'Drought' },
    { code: 'WIND_STORM', name: 'Angin Kencang/Puting Beliung', nameEn: 'Windstorm/Tornado' },
  ];

  for (const dt of disasterTypes) {
    await prisma.disasterType.upsert({
      where: { code: dt.code },
      update: {},
      create: { code: dt.code, name: dt.name, nameEn: dt.nameEn },
    });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
