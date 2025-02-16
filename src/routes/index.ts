import express from 'express';
import TestRoute from './test.route';
import CharacterRoute from './character.route';
import UserRoute from './user.route';

const router = express.Router();

router.use(TestRoute);
router.use(CharacterRoute);
router.use(UserRoute);

export default router;
