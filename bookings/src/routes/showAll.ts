import express, { Request, Response } from "express";
import { requireAuth } from "@orgakeed/commons";
import { Booking } from "../models/booking";

const router = express.Router();

router.get(
  "/api/bookings",
  requireAuth,
  async (req: Request, res: Response) => {
    const orders = await Booking.find({
      userId: req.currentUser!.id,
    }).populate("ride");

    res.send(orders);
  }
);

export { router as showAllBookingsRouter };
