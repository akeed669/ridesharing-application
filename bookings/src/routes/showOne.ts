import express, { Request, Response } from "express";
import { Booking } from "../models/booking";
import {
  BadRequestError,
  requireAuth,
  InvalidRouteError,
  NotAuthorizedError,
} from "@orgakeed/commons";

const router = express.Router();

router.get(
  "/api/bookings/:bookingId",
  requireAuth,
  async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.bookingId).populate(
      "ride"
    );

    if (!booking) {
      throw new InvalidRouteError();
    }

    if (booking.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(booking);
  }
);

export { router as showBookingRouter };
