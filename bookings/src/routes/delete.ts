import express, {Request,Response} from 'express';
import {Booking, BookingStatus} from '../models/booking';
import {requireAuth, InvalidRouteError, NotAuthorizedError} from '@orgakeed/commons';

const router=express.Router();

router.delete('/api/bookings/:bookingId', requireAuth, async(req:Request,res:Response)=>{
  const {bookingId}  = req.params;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new InvalidRouteError();
  }

  if (booking.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  booking.status=BookingStatus.Canceled;

  await booking.save();

  // this route handler is actually a PUT method since nothing is being deleted from the DB
  res.status(204).send(booking);
});

export {router as deleteBookingRouter };
