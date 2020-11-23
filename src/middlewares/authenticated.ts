import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import AppError from '../errors/AppError';

const authenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader =
    request.headers.authorization || `Bearer ${request.query.token}`;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');
  try {
    verify(token, String(process.env.API_SECRET));

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
};

export default authenticated;
