import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@orgakeed/commons';
import { body } from 'express-validator';
import { Ride } from '../models/ride';

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
  res.status(201).send(ride);
});

export { router as createRideRouter };
