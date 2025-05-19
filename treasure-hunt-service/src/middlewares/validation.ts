import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: any, property: 'body' | 'query' | 'params' = 'body') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req[property], { abortEarly: false });
      next();
    } catch (error: any) {
      next({
        statusCode: 400,
        message: 'Validation Error'
      });
    }
  };
