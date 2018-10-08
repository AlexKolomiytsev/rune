import * as express from 'express';
import boilerplate from '../api/boilerplate';

const router = express.Router();

router.use('/boilerplate', boilerplate);

export default router;
