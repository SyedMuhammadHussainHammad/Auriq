import prisma from './backend/src/config/database';

async function test() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { name: true } },
        user: { select: { name: true, email: true } }
      }
    });
    console.log("Success:", reviews.length);
  } catch (err) {
    console.error("PRISMA ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
