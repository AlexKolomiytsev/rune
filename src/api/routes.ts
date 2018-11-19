import * as express from 'express';

import { authApi, usersApi } from '@app/api';
import { isAuthenticated } from '@app/middlewares';

const router = express.Router();

router.use('/auth', authApi);
router.use('/users', isAuthenticated, usersApi);

export default router;
