import express from 'express';
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from '../controllers/aiController.js';
import protect from '../middlewares/authMiddleware.js'

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum',protect,enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc',protect,enhanceJobDescription)
aiRouter.post('/upload-resume',protect,uploadResume)

export default aiRouter;