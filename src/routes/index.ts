import express from 'express';
import TestRoute from './test.route';

const router = express.Router();

router.use(TestRoute);

export default router;
