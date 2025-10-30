import { Router, Request, Response } from 'express';
import { FalAiService } from '../services/falAiService';
import { validateTryOnRequest } from '../middleware';
import { TryOnRequest } from '../types';
import multer from 'multer';
import path from 'path';

const router = Router();
const falAiService = new FalAiService();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880')
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

router.post('/try-on', validateTryOnRequest, async (req: Request, res: Response) => {
  try {
    const { personImageUrl, garmentImageUrl, garmentType, category } = req.body as TryOnRequest;

    const falRequest = {
      person_image_url: personImageUrl,
      garment_image_url: garmentImageUrl,
      ...(garmentType && { garment_type: garmentType }),
      ...(category && { category })
    };

    const result = await falAiService.processTryOn(falRequest);

    if (result.success) {
      res.json(result);
    } else {
      res.status(503).json(result);
    }
  } catch (error) {
    console.error('Error in try-on endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

router.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const dataUrl = `data:${mimeType};base64,${base64Image}`;

    res.json({
      success: true,
      imageUrl: dataUrl,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Error in upload endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image'
    });
  }
});

router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
