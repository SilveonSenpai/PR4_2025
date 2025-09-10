import { Router } from 'express';
import { registerAdmin, loginAdmin } from '../controllers/authController';
import { body } from 'express-validator';
import { validate } from '../utils/validators';

const router = Router();

router.post('/register', [ body('email').isEmail(), body('password').isLength({ min: 6 }) ], validate, registerAdmin);
router.post('/login', [ body('email').isEmail(), body('password').isString() ], validate, loginAdmin);

export default router;
