import { Router } from 'express';

import users from './users/users.route';
import commitreviews from './commitreviews/commitreviews.route';
import repos from './repos/repos.route';

const router: Router = Router();

// Import all routes here
router.use('/commitreviews', commitreviews);
router.use('/repos', repos);
router.use('/users', users);

export default router;
