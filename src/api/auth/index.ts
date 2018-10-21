import * as express from 'express';
import {
  authLoginHandler,
  authSignUpHandler,
  authSignUpFinishHandler,
} from '@app/api/auth/handlers';

const router = express.Router();

router.post('/login', authLoginHandler.route);
router.post('/sign-up', authSignUpHandler.route);
router.post('/sign-up/finish/:verificationToken', authSignUpFinishHandler.route);

export default router;
