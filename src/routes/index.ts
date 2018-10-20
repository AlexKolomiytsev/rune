import * as express from 'express';

import { authApi, boilerplateApi } from '@app/api';

const router = express.Router();

router.use('/boilerplate', boilerplateApi);
router.use('/auth', authApi);

export default router;
