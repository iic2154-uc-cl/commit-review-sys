import cors from 'cors';
import nocache from 'nocache';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import passport from 'passport';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import home from './home';
import environment from './lib/environment';
import expressJSDocSwaggerConfig from './config/express-jsdoc-swagger.config';
import appConfig from './config/app.config';
import errorHandler from '@/middlewares/error-handler';
import routes from '@/modules/index';
import prismaClient from '@/lib/prisma';
import AuthService from '@/lib/auth';

class App {
  public express: express.Application;
  private readonly authService: AuthService;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setSessionAndPassport();
    this.authService = new AuthService(this.express);
    this.disableSettings();
    this.setRoutes();
    this.setErrorHandler();
    this.initializeDocs();
  }

  private setMiddlewares(): void {
    this.express.use(
      cors({
        origin: [
          'https://aicommit.ing.puc.cl',
          'http://aicommit.ing.puc.cl',
          'https://github.com',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-secret-key'],
        credentials: true,
      })
    );
    this.express.use(morgan('dev'));
    this.express.use(nocache());
    this.express.use(express.json({ limit: '80mb' }));
    this.express.use(express.urlencoded({ limit: '80mb', extended: true }));
    this.express.use(helmet());
    this.express.use(express.static('public'));
  }

  private setSessionAndPassport(): void {
    this.express.use(
      session({
        store: new PrismaSessionStore(prismaClient, {
          checkPeriod: 2 * 60 * 1000,
          dbRecordIdIsSessionId: true,
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          sameSite: 'none',
          secure: false,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        },
      })
    );

    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }

  private disableSettings(): void {
    this.express.disable('x-powered-by');
  }

  private setRoutes(): void {
    const {
      api: { version },
    } = appConfig;
    const { env } = environment;
    this.express.use('/', home);
    this.express.use(`/api/${version}/${env}`, routes);
  }

  private setErrorHandler(): void {
    this.express.use(errorHandler);
  }

  private initializeDocs(): void {
    expressJSDocSwagger(this.express)(expressJSDocSwaggerConfig);
  }

  public async connectPrisma(): Promise<void> {
    await prismaClient.$connect();
  }
}

export default App;
