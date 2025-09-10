import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || 'Internal Server Error' });
};
