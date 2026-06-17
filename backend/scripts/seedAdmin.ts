import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = 'uzairahmed@auriqfragrances.com';
  const password = 'Uzair600@auriq';
  
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  
  if (existingAdmin) {
    console.log('Admin already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  await prisma.admin.create({
    data: {
      first_name: 'Auriq',
      last_name: 'Admin',
      email,
      password: hashedPassword,
    }
  });

  console.log('Admin seeded successfully. Email: uzairahmed@auriqfragrances.com | Password: Uzair600@auriq');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
