import { Router } from 'express';
import { submitVideo, getJobStatus, getVideo } from '../controllers/videoController';

const router = Router();

// submit a new job
router.post('/', submitVideo);
// poll job status
router.get('/jobs/:id/status', getJobStatus);
// retrieve result
router.get('/:id', getVideo);

export default router;
