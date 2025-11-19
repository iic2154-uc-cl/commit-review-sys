import { type NextFunction, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(
      token,
      process.env.SESSION_SECRET as string,
      (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
          return res.sendStatus(403); // Forbidden
        }

        req.user = user;
        next();
      }
    );
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export const verifyAuthToken = (
  _req: Request & { isAuthenticated?: () => boolean; user?: any },
  _res: Response,
  next: NextFunction
): void => {
  // Replace with your auth token verification strategy
  // console.log('Verifying auth token...', _req);
  if (!_req.isAuthenticated()) {
    _res.status(401).json({
      message: 'Unauthorized, please login',
    });
    // next with status
    return;
  }
  next();
};

export const verifyPrivateKey = async (
  // Remove underscore of params once you start using them
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  const privateKey = _req.headers['x-secret-key'];
  if (!privateKey || privateKey !== process.env.PRIVATE_KEY) {
    _res.status(401).json({
      message: 'Unauthorized, please use a correct private key',
    });
    return;
  }
  next();
};
