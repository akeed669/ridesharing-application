import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { errorHandler,InvalidRouteError,currentUser } from '@orgakeed/commons';
import { createBookingRouter } from './routes/new';
import { showBookingRouter } from './routes/showOne';
import { showAllBookingsRouter } from './routes/showAll';
import { deleteBookingRouter } from './routes/delete';

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

app.use(currentUser);

app.use(createBookingRouter);
app.use(showBookingRouter);
app.use(showAllBookingsRouter);
app.use(deleteBookingRouter);


app.all('*', async (req, res, next) => {
  console.log('wtf hoson rides')
  next(new InvalidRouteError());
})

app.use(errorHandler);

export {app}
