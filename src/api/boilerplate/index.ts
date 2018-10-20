import * as express from 'express';
import { boilerplateGetHandler } from '@app/api/boilerplate/handlers';

const router = express.Router();

router.get('/test', boilerplateGetHandler.route);

export default router;
