import {
  Listener,
  Subjects,
  BookingExpiredEvent,
  QueueGroups,
  BookingStatus,
} from "@orgakeed/commons";
import { Message } from "node-nats-streaming";
import { Booking } from "../../models/booking";
import { BookingCanceledPublisher } from "../publishers/booking-canceled-publisher";

export class BookingExpiredListener extends Listener<BookingExpiredEvent> {
  subject: Subjects.BookingExpired = Subjects.BookingExpired;
  queueGroupName = QueueGroups.BookingServiceQueue;

  async onMessage(data: BookingExpiredEvent["data"], msg: Message) {
    const booking = await Booking.findById(data.bookingId).populate("ride");

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === BookingStatus.Completed) {
      return msg.ack();
    }

    booking.set({
      status: BookingStatus.Canceled,
    });

    await booking.save();

    await new BookingCanceledPublisher(this.client).publish({
      id: booking.id,
      version: booking.version,
      ride: {
        id: booking.ride.id,
      },
    });

    msg.ack();
  }
}
