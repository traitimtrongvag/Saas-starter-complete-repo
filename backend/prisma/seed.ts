import prisma from '../src/services/prismaClient';

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@company.com' },
    update: {},
    create: {
      email: 'demo@company.com',
      name: 'Demo User',
      password: ''
    }
  });

  await prisma.todo.createMany({
    data: [
      {
        title: 'Welcome to SaaS Starter',
        body: 'This is a seeded todo item',
        ownerId: demoUser.id
      }
    ]
  });

  console.log('Database seeded successfully');
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
