import { Router } from 'express';
import { getStory } from '../controllers/storyController';

const router = Router();

router.get('/', getStory);

export default router;
