import { type Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

type UserCreateInput = Prisma.UserCreateInput;

export default class UserService {
  @LogMessage<[UserCreateInput]>({ message: 'create-user' })
  public async createUser(data: UserCreateInput) {
    const user = await prisma.user.create({ data });
    return user;
  }

  @LogMessage<[UserCreateInput, string]>({ message: 'upsert-user' })
  public async upsertUser(data: UserCreateInput, gitName?: string) {
    const conf = {
      where: { email: data.email },
      update: {
        ...data,
      },
      create: {
        ...data,
      },
      select: {
        id: true,
        email: true,
        role: true,
        gitUser: {
          select: {
            gitName: true,
          },
        },
      },
    };
    if (gitName) {
      conf.update.gitUser = {
        connectOrCreate: {
          where: { gitName },
          create: { gitName },
        },
      };
      conf.create.gitUser = {
        connectOrCreate: {
          where: { gitName },
          create: { gitName },
        },
      };
    }
    return await prisma.user.upsert(conf);
  }

  // get user by email
  @LogMessage<[string]>({ message: 'get user by email' })
  public async getUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        gitUser: {
          select: {
            gitName: true,
          },
        },
      },
    });
    return user;
  }

  // get user by id
  @LogMessage<[number]>({ message: 'get user by id' })
  public async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        gitUser: {
          select: {
            gitName: true,
          },
        },
      },
    });
    return user;
  }

  // get all
  @LogMessage<[number, number]>({ message: 'get all gitusers' })
  public async getAllGitUsers(offset: number, limit: number) {
    const users = await prisma.gitUser.findMany({
      skip: offset,
      take: limit,
      include: {
        repos: {
          include: {
            repo: true,
          },
        },
      },
    });
    return users;
  }
}
