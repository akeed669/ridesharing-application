import express from 'express';
import { json } from 'body-parser';
import mongoose from 'mongoose';

import { currentUserRouter } from './routes/currentuser';
import { loginRouter } from './routes/login';
import { logoutRouter } from './routes/logout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { InvalidRouteError } from './errors/invalid-route';

const app = express();
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

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log('mongo connected');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000..!.')
  });

};

start();
