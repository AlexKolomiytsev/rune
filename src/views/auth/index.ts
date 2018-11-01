import * as express from 'express';
import { authVerifyEmailHandler } from '@app/views/auth/handlers';

const router = express.Router();

router.get('/verify-email', authVerifyEmailHandler.route);

export default router;
