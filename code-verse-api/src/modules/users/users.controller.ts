import { type NextFunction, type Request } from 'express';
import { type User, Role } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import UserService from './users.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class UserController extends Api {
  private readonly userService = new UserService();

  public createUser = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      // Validate the request body role
      if (req.body.role && !Object.values(Role).includes(req.body.role)) {
        this.send(
          res,
          null,
          HttpStatusCode.BadRequest,
          'role must be one of the following: USER, ADMIN, etc'
        );
        return;
      }
      // gitName should not be in body
      if (req.body.gitName) {
        this.send(
          res,
          null,
          HttpStatusCode.BadRequest,
          'gitName should not be in body'
        );
        return;
      }
      const user = await this.userService.createUser(req.body);
      this.send(res, user, HttpStatusCode.Created, 'createUser');
    } catch (e) {
      next(e);
    }
  };

  public upsertUser = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      // Validate the request body role
      if (req.body.role && !Object.values(Role).includes(req.body.role)) {
        this.send(
          res,
          null,
          HttpStatusCode.BadRequest,
          'role must be one of the following: USER, ADMIN, etc'
        );
        return;
      }
      const { gitName, ...body } = req.body;
      let user: any;
      if (!gitName) {
        user = await this.userService.upsertUser(body);
      } else {
        user = await this.userService.upsertUser(body, gitName);
      }
      this.send(res, user, HttpStatusCode.Created, 'upsertUser');
    } catch (e) {
      next(e);
    }
  };

  public getUser = async (
    req: Request,
    res: CustomResponse<User>,
    next: NextFunction
  ) => {
    try {
      const user = await this.userService.getUserByEmail(req.user.email);
      this.send(res, user, HttpStatusCode.Ok, 'getUser');
    } catch (e) {
      next(e);
    }
  };
}
