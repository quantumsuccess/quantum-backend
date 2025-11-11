import { Router } from 'express';
import { registerUser } from '../controllers/userController.js';
const router = Router();
router.route('/').post(registerUser);
export default router;
//# sourceMappingURL=userRoutes.js.map