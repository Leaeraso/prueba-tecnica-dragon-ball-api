import express from 'express';
import TestRoute from './test.route';
import CharacterRoute from './character.route';

const router = express.Router();

router.use(TestRoute);
router.use(CharacterRoute);

export default router;
