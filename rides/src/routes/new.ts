import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@orgakeed/commons';
import { body } from 'express-validator';
import { Ride } from '../models/ride';
import {RidePostedPublisher} from '../events/publishers/ride-posted-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();

router.post('/api/rides', requireAuth, [
  body('destination')
    .not()
    .isEmpty()
    .withMessage('Destination is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than zero')
], validateRequest, async (req: Request, res: Response) => {

  const { destination,price } = req.body;
  const ride = Ride.build({ destination, price, userId:req.currentUser!.id });
  await ride.save();
  await new RidePostedPublisher(natsWrapper.client).publish({

    id: ride.id,
    destination:ride.destination,
    price:ride.price,
    userId:ride.userId

  });

  res.status(201).send(ride);

});

export { router as createRideRouter };
