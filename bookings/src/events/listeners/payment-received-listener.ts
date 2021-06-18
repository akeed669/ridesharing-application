import {
  Listener,
  Subjects,
  QueueGroups,
  PaymentGeneratedEvent,
  BookingStatus,
} from "@orgakeed/commons";
import { Message } from "node-nats-streaming";
import { Booking } from "../../models/booking";

export class PaymentReceivedListener extends Listener<PaymentGeneratedEvent> {
  subject: Subjects.PaymentGenerated = Subjects.PaymentGenerated;
  queueGroupName = QueueGroups.BookingServiceQueue;

  async onMessage(data: PaymentGeneratedEvent["data"], msg: Message) {
    const booking = await Booking.findById(data.bookingId);

    if (!booking) {
      throw new Error("Booking does not exist");
    }

    booking.set({
      status: BookingStatus.Completed,
    });

    await booking.save();
    // publish an event regarding the booking being updated for versioning purpose
    msg.ack();
  }
}
