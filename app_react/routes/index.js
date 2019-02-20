import express from 'express';
import {homePageHandler} from '../controllers/index';
import {submitQuery} from '../controllers/submitQuery';

const router = express.Router();

router.get('/', homePageHandler);
router.post('/submitQuery', submitQuery);

export default router;
