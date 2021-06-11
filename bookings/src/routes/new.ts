import express, { Request, Response } from "express";
import mongoose from "mongoose";
import {
  requireAuth,
  validateRequest,
  InvalidRouteError,
  BadRequestError,
  BookingStatus,
} from "@orgakeed/commons";
import { body } from "express-validator";
import { Ride } from "../models/ride";
import { natsWrapper } from "../nats-wrapper";
import { Booking } from "../models/booking";

const router = express.Router();

const EXPIRY_TIME_SECONDS = 20 * 60;

router.post(
  "/api/bookings",
  requireAuth,
  [
    body("rideId")
      .not()
      .isEmpty()
      .withMessage("A rideId is required")
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)),
    //to ensure that the ID has a format identical to a mongoDB id ; this results in loose coupling
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { rideId } = req.body;

    // locate the desired ride advertisement from DB

    const ride = await Ride.findById(rideId);

    if (!ride) {
      throw new InvalidRouteError();
    }

    // check whether the ride has already been reserved

    // const isReserved = await ride.isReserved();

    const existingBooking = await Booking.findOne({
        ride: this,
        status: {
          $in: [
            BookingStatus.Created,
            BookingStatus.PaymentPending,
            BookingStatus.Completed,
          ],
        },
      });

    if (existingBooking) {
      throw new BadRequestError("Ride is already booked!");
    }

    // calculate expiry time/date for reservation

    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + EXPIRY_TIME_SECONDS);

    // create the booking and save to DB

    const booking = Booking.build({
      userId: req.currentUser!.id,
      status: BookingStatus.Created,
      expiresAt: expiry,
      ride,
    });

    await booking.save();

    // publish an event notifying that a booking was created
    res.status(201).send(booking);
  }
);

export { router as createBookingRouter };
