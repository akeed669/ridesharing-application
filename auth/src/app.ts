import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { loginRouter } from './routes/login';
import { logoutRouter } from './routes/logout';
import { signupRouter } from './routes/signup';
import { errorHandler,InvalidRouteError } from '@orgakeed/commons';


const app = express();
// since traffic is coming through an Ingress proxy, instruct Express to
// allow such traffic
app.set('trust proxy', true);
app.use(cookieSession({
  // cookie encryption will be disabled
  signed:false,
  // cookies will be sent only when making https requests
  //secure:true;
  secure:process.env.NODE_ENV !== 'test'
}))

app.use(json());
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
