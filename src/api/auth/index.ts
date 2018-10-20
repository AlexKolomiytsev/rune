import * as express from 'express';
import { authLoginHandler } from '@app/api/auth/handlers';

const router = express.Router();

router.post('/login', authLoginHandler.route);

export default router;
