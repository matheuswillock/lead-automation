import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Criar o plano único de assinatura
  const plan = await prisma.subscriptionPlan.upsert({
    where: { name: 'Professional' },
    update: {},
    create: {
      name: 'Professional',
      price: 19.90,
      description: 'Extração e geração de leads rápida e consistente. Acesso completo a todas as funcionalidades.',
    },
  })

  console.log('✅ Plano Professional criado:', plan)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro ao fazer seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
