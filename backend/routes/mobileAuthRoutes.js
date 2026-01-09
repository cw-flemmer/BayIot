import express from 'express';
const router = express.Router();
import * as mobileAuthController from '../controllers/mobileAuthController.js';

router.post('/login', mobileAuthController.login);

export default router;
