import {
  Listener,
  Subjects,
  QueueGroups,
  BookingCanceledEvent,
  BookingStatus,
} from "@orgakeed/commons";
import { Message } from "node-nats-streaming";
import { Booking } from "../../models/booking";

export class BookingCanceledListener extends Listener<BookingCanceledEvent> {
  subject: Subjects.BookingCanceled = Subjects.BookingCanceled;
  queueGroupName = QueueGroups.PaymentServiceQueue;

  async onMessage(data: BookingCanceledEvent["data"], msg: Message) {
    const booking = await Booking.findByEvent(data);

    if (!booking) {
      throw new Error("Booking not found");
    }

    booking.set({
      status: BookingStatus.Canceled,
    });

    await booking.save();

    msg.ack();
  }
}
