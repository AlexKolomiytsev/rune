import * as express from 'express';
import boilerplateGetHandler from './handlers/boilerplateGet.handler';

const router = express.Router();

router.get('/test', boilerplateGetHandler.route);

export default router;
