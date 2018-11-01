import * as express from 'express';

import { authApi, boilerplateApi } from '@app/api';
import { isAuthenticated } from '@app/middlewares';

const router = express.Router();

router.use('/boilerplate', isAuthenticated, boilerplateApi);
router.use('/auth', authApi);

export default router;
