import * as express from 'express';
import { authViews } from '@app/views';

const router = express.Router();

router.use('/auth', authViews);

export default router;
