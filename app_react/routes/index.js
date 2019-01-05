import express from 'express';
import {homePageHandler} from '../controllers/index';

const router = express.Router();

router.get('/', homePageHandler);


export default router;
