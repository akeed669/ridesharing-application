import express, { Request, Response } from "express";
import { Booking, BookingStatus } from "../models/booking";
import {
  requireAuth,
  InvalidRouteError,
  NotAuthorizedError,
} from "@orgakeed/commons";
import { BookingCanceledPublisher } from "./../events/publishers/booking-canceled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/bookings/:bookingId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("ride");

    if (!booking) {
      throw new InvalidRouteError();
    }

    if (booking.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    booking.status = BookingStatus.Canceled;

    await booking.save();
    //publish the event

    new BookingCanceledPublisher(natsWrapper.client).publish({
      id: booking.id,
      ride: {
        id: booking.ride.id,
      },
      version: booking.version,
    });

    // this route handler is actually a PUT method since nothing is being deleted from the DB
    res.status(204).send(booking);
  }
);

export { router as deleteBookingRouter };
