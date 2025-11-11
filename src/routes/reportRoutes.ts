import { Router } from 'express';
import { foundationalBluePrintReport } from '../controllers/reports.js';

const router = Router();

router.route('/foundationalBluePrintReport').get(foundationalBluePrintReport);

export default router;