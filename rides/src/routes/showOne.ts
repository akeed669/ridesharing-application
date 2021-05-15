import express, { Request, Response } from 'express';
import { Ride } from '../models/ride';
import {InvalidRouteError} from '@orgakeed/commons';

const router = express.Router();

router.get('/api/rides/:id', async(req:Request, res:Response)=>{
  const ride = await Ride.findById(req.params.id);

  if(!ride){
    throw new InvalidRouteError();
  }
  res.send(ride);
});

export {router as showRideRouter};
