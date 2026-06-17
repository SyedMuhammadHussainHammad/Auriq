import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ads = await prisma.ad.findMany();
  console.log('Total ads:', ads.length);
  if (ads.length > 0) {
    const ad = ads[0];
    console.log('Attempting to delete ad:', ad.id);
    try {
      await prisma.ad.delete({ where: { id: ad.id } });
      console.log('Ad deleted successfully!');
      
      // recreate it so we don't break the user's data
      await prisma.ad.create({ data: {
        ...ad,
        id: undefined,
      }});
      console.log('Ad recreated!');
    } catch (e) {
      console.error('Delete failed:', e);
    }
  }
}

main().finally(() => prisma.$disconnect());
