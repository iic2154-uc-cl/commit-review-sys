import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import passport from 'passport';
import { Strategy as CasStrategy } from 'passport-cas2';
import jwt from 'jsonwebtoken';
import UserService from '@/modules/users/users.service';

// Extend the Request interface to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
    isAuthenticated: () => boolean;
    logout: () => void;
  }
}

export default class AuthService {
  private readonly userService = new UserService();
  private readonly router = Router();

  constructor(private readonly app: any) {
    this.initializePassport();
    this.app.use('/auth', this.router);
    this.setupRoutes();
  }

  private readonly initializePassport = () => {
    passport.use(
      'auth-cas',
      new CasStrategy(
        {
          casURL: process.env.CAS2,
        },
        async (usrname: any, profile: any, done: any) => {
          try {
            const user = await this.userService.getUserByEmail(profile.mail[0]);
            if (user) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          } catch (error) {
            return done(error, null);
          }
        }
      )
    );

    passport.serializeUser((user: any, cb: any) => {
      cb(null, user.id);
    });

    passport.deserializeUser(async (id: any, cb: any) => {
      try {
        const user = await this.userService.getUserById(id);
        if (user) {
          cb(null, user);
        }
        cb(null, null);
      } catch (error) {
        cb(error, null);
      }
    });
  };

  private setupRoutes() {
    this.router.get(
      '/login',
      (req: Request, res: Response, next: NextFunction) => {
        next();
      },
      passport.authenticate('auth-cas', {
        failureRedirect: '/login',
        failureMessage: true,
      }),
      (req: Request, res: Response): void => {
        if (!req.user) {
          res.status(401).json({ error: 'Unauthorized' });
          return;
        }

        // Generate token
        const token = jwt.sign(
          {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
          },
          process.env.SESSION_SECRET as string,
          { expiresIn: '1d' }
        );
        res.redirect(`/?token=${token}`);
      }
    );

    this.router.post('/logout', this.logout.bind(this));

    this.router.get('/me', (req: Request, res: Response) => {
      if (req.isAuthenticated()) {
        res.json({ user: req.user });
      } else {
        res.status(401).json({ error: 'Not authenticated' });
      }
    });
  }

  public logout = async (req: Request, res: Response) => {
    if (req.logout) {
      req.logout();
    } else {
      console.error('Logout method is not defined on the request object.');
    }
    res.redirect('/');
  };
}
