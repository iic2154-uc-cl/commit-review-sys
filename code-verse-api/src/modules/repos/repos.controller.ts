import { type NextFunction, type Request } from 'express';
import { type Repo } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import RepoService from './repos.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class RepoController extends Api {
  private readonly repoService = new RepoService();

  public createRepo = async (
    req: Request,
    res: CustomResponse<Repo>,
    next: NextFunction
  ) => {
    try {
      const repo = await this.repoService.createRepo(req.body);
      this.send(res, repo, HttpStatusCode.Created, 'createRepo');
    } catch (e) {
      next(e);
    }
  };

  public getAllRepos = async (
    req: Request,
    res: CustomResponse<Repo[]>,
    next: NextFunction
  ) => {
    try {
      const { offset, limit } = req.query;
      const repos = await this.repoService.getAllRepos(
        Number(offset) || 0,
        Number(limit) || 10
      );
      this.send(res, repos, HttpStatusCode.Ok, 'getAllRepos');
    } catch (e) {
      next(e);
    }
  };
}
