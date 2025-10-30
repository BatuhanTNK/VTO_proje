import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

export const validateTryOnRequest = (req: Request, res: Response, next: NextFunction) => {
  const { personImageUrl, garmentImageUrl } = req.body;

  if (!personImageUrl || typeof personImageUrl !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'personImageUrl is required and must be a string'
    });
  }

  if (!garmentImageUrl || typeof garmentImageUrl !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'garmentImageUrl is required and must be a string'
    });
  }

  const urlPattern = /^https?:\/\/.+/i;
  if (!urlPattern.test(personImageUrl)) {
    return res.status(400).json({
      success: false,
      error: 'personImageUrl must be a valid HTTP/HTTPS URL'
    });
  }

  if (!urlPattern.test(garmentImageUrl)) {
    return res.status(400).json({
      success: false,
      error: 'garmentImageUrl must be a valid HTTP/HTTPS URL'
    });
  }

  next();
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
