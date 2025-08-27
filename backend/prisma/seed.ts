import prisma from '../src/services/prismaClient'

async function main(){
  const u = await prisma.user.upsert({ where: { email: 'demo@company.com' }, update: {}, create: { email: 'demo@company.com', name: 'Demo User', password: '' } })
  await prisma.todo.createMany({ data: [
    { title: 'Welcome', body: 'Seeded todo', ownerId: u.id }
  ]})
}

main().catch(e => { console.error(e); process.exit(1) }).finally(()=>process.exit())
