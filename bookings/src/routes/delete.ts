import express, { Request, Response } from "express";
import {
  requireAuth,
  NotAuthorizedError,
  InvalidRouteError,
} from "@orgakeed/commons";
import { natsWrapper } from "../nats-wrapper";
import { Booking, BookingStatus } from "../models/booking";

const router = express.Router();

router.delete(
  "/api/bookings/:bookingId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { bookingId } = req.params;

    const booking = Booking.findById(bookingId);

    if (!booking) {
      throw new InvalidRouteError();
    }

    if (booking.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    booking.status = BookingStatus.Canceled;

    await booking.save();

    // publish an event notifying that a booking was canceled

    res.send(booking);
  }
);

export { router as deleteBookingRouter };
