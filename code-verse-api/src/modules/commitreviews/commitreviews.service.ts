import { type Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

type CommitReviewCreateInput = Prisma.CommitReviewCreateWithoutRepoOnUserInput;

export default class CommitReviewService {
  @LogMessage<[CommitReviewCreateInput, string, string]>({
    message: 'create-commitreview',
  })
  public async createCommitReview(
    data: CommitReviewCreateInput,
    repoName: string,
    gitName: string
  ) {
    return await prisma.commitReview.create({
      data: {
        ...data,
        repoOnUser: {
          connectOrCreate: {
            where: {
              gitName_repoName: { gitName, repoName },
            },
            create: {
              gitUser: {
                connectOrCreate: {
                  where: { gitName },
                  create: { gitName },
                },
              },
              repo: {
                connectOrCreate: {
                  where: { name: repoName },
                  create: { name: repoName },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get commit reviews by SHA (optionally filtered), with pagination.
   */
  @LogMessage<[number, number]>({ message: 'get commitreviews' })
  public async getCommitReviewsBySha(
    offset: number,
    limit: number,
    sha?: string
  ) {
    const where: Prisma.CommitReviewWhereInput = sha ? { sha } : {};

    return await prisma.commitReview.findMany({
      skip: offset,
      take: limit,
      where,
      include: {
        repoOnUser: {
          include: {
            repo: true,
            gitUser: true,
          },
        },
      },
    });
  }

  /**
   * Get commit reviews filtered by repo and/or gitName, with pagination.
   */
  @LogMessage<[number, number, string?, string?]>({
    message: 'get commitreviews filtered',
  })
  public async getCommitReviews(
    offset: number,
    limit: number,
    repo?: string | undefined,
    gitName?: string | undefined
  ) {
    const where: Prisma.CommitReviewWhereInput = {};

    if (repo ?? gitName) {
      where.repoOnUser = {
        ...(repo && { repo: { name: repo } }),
        ...(gitName && { gitUser: { gitName } }),
      };
    }

    return await prisma.commitReview.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        repoOnUser: {
          include: {
            repo: true,
            gitUser: true,
          },
        },
      },
    });
  }
}
