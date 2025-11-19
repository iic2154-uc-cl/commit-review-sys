import { Router } from 'express';
import Controller from './commitreviews.controller';
import { CreateCommitReviewDto } from '@/dto/commitreview.dto';
import RequestValidator from '@/middlewares/request-validator';
import { authenticateJWT, verifyPrivateKey } from '@/middlewares/auth';

const commitreviews: Router = Router();
const controller = new Controller();

/**
 * Create commit review body
 * @typedef {object} CreateCommitReviewBody
 * @property {string} sha.required - SHA identifier of the commit
 * @property {number} repoOnUserId.required - ID of RepoOnUser entity
 * @property {string} reviewBy.required - Reviewer type (AI or HUMAN)
 * @property {string} reviewer.required - Reviewer's name
 * @property {string} message.required - Commit message
 * @property {string} suggested.required - Suggested commit message
 * @property {number} adherence - Adherence score (optional)
 * @property {string} adherence_comment - Comment on adherence (optional)
 * @property {number} vulnerability - Vulnerability score (optional)
 * @property {string} vulnerability_comment - Vulnerability comment (optional)
 * @property {string} complexity_comment - Complexity comment (optional)
 * @property {number} singleResponsibility - Single responsibility principle score (optional)
 * @property {string} singleResponsibility_comment - Single responsibility comment (optional)
 * @property {number} openClosed - Open-closed principle score (optional)
 * @property {string} openClosed_comment - Open-closed comment (optional)
 * @property {number} liskovSubstitution - Liskov substitution principle score (optional)
 * @property {string} liskovSubstitution_comment - Liskov substitution comment (optional)
 * @property {number} interfaceSegregation - Interface segregation principle score (optional)
 * @property {string} interfaceSegregation_comment - Interface segregation comment (optional)
 * @property {number} dependencyInversion - Dependency inversion principle score (optional)
 * @property {string} dependencyInversion_comment - Dependency inversion comment (optional)
 */

/**
 * CommitReview
 * @typedef {object} CommitReview
 * @property {number} id - Commit review ID
 * @property {string} sha - SHA identifier of the commit
 * @property {number} repoOnUserId - RepoOnUser entity ID
 * @property {string} reviewBy - Reviewer type (AI or HUMAN)
 * @property {string} reviewer - Reviewer's name
 * @property {string} message - Commit message
 * @property {string} suggested - Suggested commit message
 * @property {number} adherence - Adherence score
 * @property {string} adherence_comment - Comment on adherence
 * @property {number} vulnerability - Vulnerability score
 * @property {string} vulnerability_comment - Vulnerability comment
 * @property {string} complexity_comment - Complexity comment
 * @property {number} singleResponsibility - Single responsibility principle score
 * @property {string} singleResponsibility_comment - Single responsibility comment
 * @property {number} openClosed - Open-closed principle score
 * @property {string} openClosed_comment - Open-closed comment
 * @property {number} liskovSubstitution - Liskov substitution principle score
 * @property {string} liskovSubstitution_comment - Liskov substitution comment
 * @property {number} interfaceSegregation - Interface segregation principle score
 * @property {string} interfaceSegregation_comment - Interface segregation comment
 * @property {number} dependencyInversion - Dependency inversion principle score
 * @property {string} dependencyInversion_comment - Dependency inversion comment
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last updated timestamp
 */

// Routes

// Create commit review
commitreviews.post(
  '/',
  verifyPrivateKey,
  RequestValidator.validate(CreateCommitReviewDto),
  controller.createCommitReview
);

// Get commit reviews by SHA
commitreviews.get('/:sha', authenticateJWT, controller.getCommitReviewsBySha);
// Get all commit reviews
commitreviews.get('/', authenticateJWT, controller.getAllCommitReviews);

/// unprotected routes
// Get commit reviews by SHA
commitreviews.get(
  '/u/:sha',
  verifyPrivateKey,
  controller.getCommitReviewsBySha
);
// Get all commit reviews
commitreviews.get('/u/', verifyPrivateKey, controller.getAllCommitReviews);

export default commitreviews;
