import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  InvalidRouteError,
  NotAuthorizedError,
  BookingStatus,
} from "@orgakeed/commons";
import { Booking } from "../models/booking";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { PaymentReceivedPublisher } from "../events/publishers/payment-received-publisher";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("bookingId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { bookingId, token } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      throw new InvalidRouteError();
    }

    if (booking.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (booking.status === BookingStatus.Canceled) {
      throw new BadRequestError("This booking is canceled");
    }

    const charge = await stripe.charges.create({
      currency: "eur",
      //stripe works with cent values
      amount: booking.price * 100,
      source: token,
    });

    const payment = Payment.build({
      stripeId: charge.id,
      bookingId,
    });

    await payment.save();

    await new PaymentReceivedPublisher(natsWrapper.client).publish({
      id: payment.id,
      stripeId: payment.stripeId,
      bookingId: payment.bookingId,
    });

    res.send({ id: payment.id });
  }
);

export { router as createChargeRouter };
