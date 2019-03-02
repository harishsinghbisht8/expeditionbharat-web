import express from 'express';
import {homePageHandler, tripPageHandler} from '../controllers/index';
import {submitQuery} from '../controllers/submitQuery';

const router = express.Router();

router.get('/', homePageHandler);
router.get('/trip/:tripName', tripPageHandler);
router.post('/submit-query', submitQuery);

export default router;
