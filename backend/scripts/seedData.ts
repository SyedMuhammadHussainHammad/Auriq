import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // Categories
  const men = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: { name: 'Men', slug: 'men', is_active: true }
  })

  const women = await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: { name: 'Women', slug: 'women', is_active: true }
  })

  const unisex = await prisma.category.upsert({
    where: { slug: 'unisex' },
    update: {},
    create: { name: 'Unisex', slug: 'unisex', is_active: true }
  })

  const bundles = await prisma.category.upsert({
    where: { slug: 'bundles' },
    update: {},
    create: { name: 'Bundles', slug: 'bundles', is_active: true }
  })

  const giftSets = await prisma.category.upsert({
    where: { slug: 'gift-sets' },
    update: {},
    create: { name: 'Gift Sets', slug: 'gift-sets', is_active: true }
  })

  console.log('✅ Categories created')

  // Products
  const laceda = await prisma.product.upsert({
    where: { slug: 'laceda' },
    update: {},
    create: {
      name: 'Laceda',
      slug: 'laceda',
      brand: 'Auriq',
      description: 'A bold and sophisticated fragrance with woody and aromatic notes.',
      fragrance_type: 'Woody',
      gender: 'MALE',
      is_active: true,
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: false,
      category_id: men.id,
      fragrance_notes: {
        create: [
          { note_type: 'TOP', note_name: 'Bergamot' },
          { note_type: 'TOP', note_name: 'Mint' },
          { note_type: 'HEART', note_name: 'Lavandin' },
          { note_type: 'HEART', note_name: 'Cypress' },
          { note_type: 'BASE', note_name: 'Patchouli' },
          { note_type: 'BASE', note_name: 'Vetiver' },
        ]
      },
      variants: {
        create: [
          { size_ml: 10, price: 999, stock_quantity: 50, sku: 'AURIQ-LACEDA-10ML' },
          { size_ml: 50, price: 4999, stock_quantity: 100, sku: 'AURIQ-LACEDA-50ML' },
          { size_ml: 100, price: 7999, stock_quantity: 75, sku: 'AURIQ-LACEDA-100ML' },
        ]
      }
    }
  })

  const angelica = await prisma.product.upsert({
    where: { slug: 'angelica' },
    update: {},
    create: {
      name: 'Angelica',
      slug: 'angelica',
      brand: 'Auriq',
      description: 'A delicate floral fragrance with fresh and feminine notes.',
      fragrance_type: 'Floral',
      gender: 'FEMALE',
      is_active: true,
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: true,
      category_id: women.id,
      fragrance_notes: {
        create: [
          { note_type: 'TOP', note_name: 'Rose' },
          { note_type: 'TOP', note_name: 'Peach' },
          { note_type: 'HEART', note_name: 'Jasmine' },
          { note_type: 'HEART', note_name: 'Lily' },
          { note_type: 'BASE', note_name: 'Musk' },
          { note_type: 'BASE', note_name: 'Amber' },
        ]
      },
      variants: {
        create: [
          { size_ml: 10, price: 999, stock_quantity: 50, sku: 'AURIQ-ANGELICA-10ML' },
          { size_ml: 50, price: 4999, stock_quantity: 100, sku: 'AURIQ-ANGELICA-50ML' },
          { size_ml: 100, price: 7999, stock_quantity: 75, sku: 'AURIQ-ANGELICA-100ML' },
        ]
      }
    }
  })

  const noir = await prisma.product.upsert({
    where: { slug: 'noir-essence' },
    update: {},
    create: {
      name: 'Noir Essence',
      slug: 'noir-essence',
      brand: 'Auriq',
      description: 'A mysterious and captivating unisex fragrance.',
      fragrance_type: 'Oriental',
      gender: 'UNISEX',
      is_active: true,
      is_featured: false,
      is_best_seller: false,
      is_new_arrival: true,
      category_id: unisex.id,
      fragrance_notes: {
        create: [
          { note_type: 'TOP', note_name: 'Black Pepper' },
          { note_type: 'TOP', note_name: 'Cardamom' },
          { note_type: 'HEART', note_name: 'Oud' },
          { note_type: 'HEART', note_name: 'Rose' },
          { note_type: 'BASE', note_name: 'Sandalwood' },
          { note_type: 'BASE', note_name: 'Vanilla' },
        ]
      },
      variants: {
        create: [
          { size_ml: 10, price: 1299, stock_quantity: 30, sku: 'AURIQ-NOIR-10ML' },
          { size_ml: 50, price: 5999, stock_quantity: 80, sku: 'AURIQ-NOIR-50ML' },
          { size_ml: 100, price: 9999, stock_quantity: 60, sku: 'AURIQ-NOIR-100ML' },
        ]
      }
    }
  })

  console.log('✅ Products created')

  // Bundle
  await prisma.bundle.upsert({
    where: { slug: 'laceda-angelica-bundle' },
    update: {},
    create: {
      name: 'Laceda & Angelica Bundle',
      slug: 'laceda-angelica-bundle',
      description: 'The perfect pair — bold masculinity meets delicate femininity.',
      price: 8999,
      original_price: 9998,
      is_active: true
    }
  })

  console.log('✅ Bundle created')

  // Discount code
  await prisma.discountCode.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
      min_order: 2000,
      is_active: true
    }
  })

  console.log('✅ Discount code created')

  // Shipping config
  const existingConfig = await prisma.shippingConfig.findFirst()
  if (!existingConfig) {
    await prisma.shippingConfig.create({
      data: {
        flat_fee: 200,
        free_shipping_above: 5000
      }
    })
    console.log('✅ Shipping config created')
  }

  // Ad / Banner
  await prisma.ad.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Free Delivery on Orders Above Rs. 5000',
      image_url: 'https://placeholder.com/banner.jpg',
      position: 'ANNOUNCEMENT_BAR',
      is_active: true
    }
  })

  console.log('✅ Ad created')
  console.log('🎉 All seed data inserted successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })