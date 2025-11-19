import { type Repo } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class RepoService {
  @LogMessage<[Repo]>({ message: 'create-repo' })
  public async createRepo(data: Repo) {
    return await prisma.repo.create({ data });
  }

  // get all repos: use offset and limit
  @LogMessage<[number, number]>({ message: 'get all repos' })
  public async getAllRepos(offset: number, limit: number) {
    return await prisma.repo.findMany({
      skip: offset,
      take: limit,
      include: {
        users: {
          include: {
            gitUser: true,
          },
        },
      },
    });
  }
}
