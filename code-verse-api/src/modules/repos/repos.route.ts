import { Router } from 'express';
import Controller from './repos.controller';
import { CreateRepoDto } from '@/dto/repo.dto';
import RequestValidator from '@/middlewares/request-validator';
import { authenticateJWT } from '@/middlewares/auth';

const repos: Router = Router();
const controller = new Controller();

/**
 * Create repo body
 * @typedef {object} CreateRepoBody
 * @property {string} name.required - name of repo
 */
/**
 * Repo
 * @typedef {object} Repo
 * @property {string} name - name of repo
 * @property {string} id - id of repo
 * @property {string} createdAt - created at
 * @property {string} updatedAt - updated at
 * /
 /**
 * POST /repos/create
 * @summary Create repo
 * @tags repos
 * @param {CreateRepoBody} request.body.required
 * @return {Repo} 201 - repo created
 * @return {string} 400 - Bad request
 * @return {string} 401 - Unauthorized
 * @return {string} 403 - Forbidden
 * @return {string} 404 - Not found
 * @return {string} 500 - Internal server error
 * @return {string} 502 - Bad gateway
 * @return {string} 503 - Service unavailable
 */
repos.post(
  '/create',
  authenticateJWT,
  RequestValidator.validate(CreateRepoDto),
  controller.createRepo
);

/**
 * GET /repos
 * @summary Get repos
 * @tags repos
 * @return {Repo[]} 200 - repos
 * @return {string} 400 - Bad request
 * @return {string} 401 - Unauthorized
 * @return {string} 403 - Forbidden
 * @return {string} 404 - Not found
 * @return {string} 500 - Internal server error
 * @return {string} 502 - Bad gateway
 * @return {string} 503 - Service unavailable
 */
repos.get('/', authenticateJWT, controller.getAllRepos);

export default repos;
