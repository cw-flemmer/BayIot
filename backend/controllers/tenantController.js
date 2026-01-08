import Tenant from '../models/Tenant.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for logo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = '/app/public/images';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `logo-${req.tenant.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|svg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, png, svg) are allowed.'));
    }
}).single('logo');

export const updateSettings = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { name, theme } = req.body;
            const tenant = await Tenant.findByPk(req.tenant.id);

            if (!tenant) {
                return res.status(404).json({ message: 'Tenant not found.' });
            }

            if (name) tenant.name = name;
            if (theme) tenant.theme = theme;

            if (req.file) {
                // If there's an old logo, we might want to delete it, but for now let's just update
                tenant.logo = `/images/${req.file.filename}`;
            }

            await tenant.save();

            res.json({
                message: 'Settings updated successfully',
                tenant: {
                    name: tenant.name,
                    logo: tenant.logo,
                    theme: tenant.theme
                }
            });
        } catch (error) {
            console.error('Update settings error:', error);
            res.status(500).json({ message: 'Server error during settings update.' });
        }
    });
};
