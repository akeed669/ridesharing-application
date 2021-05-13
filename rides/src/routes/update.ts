import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotAuthorizedError, BadRequestError } from '@orgakeed/commons';
import { body } from 'express-validator';
import { Ride } from '../models/ride';

const router = express.Router();

router.put('/api/rides/:id', requireAuth,
[
  body('destination')
  .not()
  .isEmpty()
  .withMessage('Title is required'),
  body('price')
  .isFloat({ gt: 0 })
  .withMessage('Price must be greater than zero')

], validateRequest, async(req:Request, res:Response)=>{
  const ride = await Ride.findById(req.params.id);

  if(!ride){
    throw new BadRequestError('Unable to find the desired advertisement');
  }

  if(ride.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  }

  ride.set({
    destination: req.body.destination,
    price: req.body.price
  });

  await ride.save();

  res.send(ride);

})

export { router as updateRideRouter };
