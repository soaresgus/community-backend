import { faker } from '@faker-js/faker';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

// Definição dos papéis (roles) disponíveis conforme o schema
const roles = [
  'member',
  'vip-hero',
  'vip-legend',
  'vip-supreme',
  'partner',
  'helper',
  'moderator',
  'moderator+',
  'manager',
  'manager+',
  'master',
];

async function main() {
  // Array para armazenar os 30 usuários
  const users = [];

  for (let i = 0; i < 30; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const nameWithSurname = `${name} ${surname}`;

    users.push({
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      nameWithSurname,
      discord: faker.internet.username(),
      ign: faker.internet.username(),
      email: faker.internet.email(),
      password: await bcrypt.hash('123456', 10),
      avatarUrl: `https://mc-heads.net/avatar/${faker.internet.username()}/400`,
      role: roles[Math.floor(Math.random() * roles.length)],
      permissions: {
        canCreatePost: true,
        canDeletePost: true,
        canEditPost: true,
        canFixPost: false,
        canDeleteAllPost: false,
        canEditAllPost: false,
        canCreateComment: true,
        canDeleteComment: false,
        canEditComment: false,
        canDeleteAllComment: false,
        canEditAllComment: false,
        canDeleteUser: false,
        canEditUser: false,
      },
      createdAt: faker.date.past(),
    });
  }

  // Insere os usuários no banco de dados com o método createMany do Prisma
  await prisma.users.createMany({
    data: users,
  });

  console.log('30 usuários mockados criados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
