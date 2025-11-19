import { PrismaClient } from '@prisma/client';
// import { faker } from '@faker-js/faker';
import logger from '../src/lib/logger';
// import { HR } from '../src/utils/helper';

const prisma = new PrismaClient();
// const seedUsers = async (): Promise<void> => {
//   const fakeUsers = faker.helpers.uniqueArray<User>(
//     () => ({
//       id: faker.number.int(), // Assuming `id` is a number
//       email: faker.internet.email(),
//       gitName: faker.internet.userName(),
//       role: Role.ASSISTANT, // Ensure 'USER' is cast to the Role type
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     }),
//     1
//   );
//   const users = await prisma.user.createMany({ data: fakeUsers });
//   logger.info(`
//     \r${HR('white', '-', 30)}
//     \rSeed completed for model: user
//     \rcount: ${users.count}
//     \r${HR('white', '-', 30)}
//   `);
// };

async function seed(): Promise<void> {
  await Promise.all([
    // seedUsers()
  ]);
}

async function main(): Promise<void> {
  let isError: boolean = false;
  try {
    await seed();
  } catch (e) {
    isError = true;
    logger.error(e);
  } finally {
    await prisma.$disconnect();
    process.exit(isError ? 1 : 0);
  }
}

void main();
