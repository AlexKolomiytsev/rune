import * as express from 'express';
import { usersGetMeHandler } from '@app/api/users/handlers';

const router = express.Router();

router.get('/me', usersGetMeHandler.route);

export default router;
