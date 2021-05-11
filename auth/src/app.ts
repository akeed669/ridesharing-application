import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { loginRouter } from './routes/login';
import { logoutRouter } from './routes/logout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { InvalidRouteError } from './errors/invalid-route';

const app = express();
// traffic comes through ingress nginx, i.e make express allow such traffic
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  // cookie encryption will be disabled
  // in order to make cookie content readable when using different backend
  // languages for the different services
  signed:false,
  // cookies will be sent only when making https requests
  secure:process.env.NODE_ENV !== 'test'
}))

app.use(currentUserRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(signupRouter);

app.all('*', async (req, res, next) => {
  console.log('wtf hoson')
  next(new InvalidRouteError());
})

app.use(errorHandler);

export {app}
