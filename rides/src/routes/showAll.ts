import express, { Request, Response } from 'express';
import { Ride } from '../models/ride';

const router = express.Router();

router.get('/api/rides', async(req:Request, res:Response)=>{

  const rides = await Ride.find({});

  res.send(rides);
});

export {router as showAllRidesRouter};
