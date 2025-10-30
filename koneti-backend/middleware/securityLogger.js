import { logger } from '../utils/logger.js';

export const securityLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    };

    // Log suspicious activities
    if (res.statusCode >= 400) {
      logger.warn('Suspicious request detected', logData);
    }

    // Log admin activities
    if (req.originalUrl.startsWith('/api/admin')) {
      logger.info('Admin activity', {
        ...logData,
        adminId: req.admin?.id || 'unauthenticated'
      });
    }
  });

  next();
};