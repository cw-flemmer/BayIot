import express from 'express';
import {
    getAllTenants,
    createTenant,
    updateTenant,
    deleteTenant
} from '../controllers/superTenantController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import siteAdminMiddleware from '../middleware/siteAdminMiddleware.js';
import tenantDetection from '../middleware/tenantDetection.js';

const router = express.Router();

// Super routes required authentication and site-admin role
router.use(authMiddleware);
router.use(siteAdminMiddleware);

router.get('/', getAllTenants);
router.post('/', createTenant);
router.put('/:id', updateTenant);
router.delete('/:id', deleteTenant);

export default router;
