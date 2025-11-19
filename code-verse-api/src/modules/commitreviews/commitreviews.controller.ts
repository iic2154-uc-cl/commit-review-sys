import { type NextFunction, type Request } from 'express';
import { type CommitReview, ReviewBy } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import CommitReviewService from './commitreviews.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class CommitReviewController extends Api {
  private readonly commitReviewService = new CommitReviewService();

  public createCommitReview = async (
    req: Request,
    res: CustomResponse<CommitReview>,
    next: NextFunction
  ) => {
    try {
      const { user: gitName, repo: repoName, ...data } = req.body;

      // Validate the request body
      if (!gitName || !repoName) {
        this.send(
          res,
          null,
          HttpStatusCode.BadRequest,
          'gitName and repoName are required'
        );
        return;
      }
      // validate the reviewBy if is included
      if (data.reviewBy && !Object.values(ReviewBy).includes(data.reviewBy)) {
        this.send(
          res,
          null,
          HttpStatusCode.BadRequest,
          'reviewBy must be one of the following: AI, HUMAN'
        );
        return;
      }

      const repo = await this.commitReviewService.createCommitReview(
        data,
        repoName,
        gitName
      );
      this.send(res, repo, HttpStatusCode.Created, 'createRepo');
    } catch (e) {
      next(e);
    }
  };

  public getCommitReviewsBySha = async (
    req: Request,
    res: CustomResponse<CommitReview[]>,
    next: NextFunction
  ) => {
    try {
      const { offset = 0, limit = 10 } = req.query;
      const sha = req.params.sha;
      const commitReviews =
        await this.commitReviewService.getCommitReviewsBySha(
          Number(offset),
          Number(limit),
          sha
        );
      this.send(res, commitReviews);
    } catch (e) {
      next(e);
    }
  };

  public getAllCommitReviews = async (
    req: Request,
    res: CustomResponse<CommitReview[]>,
    next: NextFunction
  ) => {
    try {
      const { offset = 0, limit = 10, repo } = req.query;
      const { rol, gitUser } = req.user || {};
      const gitName = gitUser?.gitName;

      let commitReviews: CommitReview[] = [];
      // if role is Leader, student or guest, get commit reviews by gitName
      if (rol === 'LEADER' || rol === 'STUDENT' || rol === 'GUEST') {
        commitReviews = await this.commitReviewService.getCommitReviews(
          Number(offset),
          Number(limit),
          repo as string | undefined,
          gitName
        );
      } else {
        commitReviews = await this.commitReviewService.getCommitReviews(
          Number(offset),
          Number(limit),
          repo as string | undefined,
          gitName
        );
      }

      this.send(res, commitReviews);
    } catch (e) {
      next(e);
    }
  };
}
