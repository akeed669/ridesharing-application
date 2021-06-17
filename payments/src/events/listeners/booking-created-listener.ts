import {
  Listener,
  Subjects,
  QueueGroups,
  BookingCreatedEvent,
} from "@orgakeed/commons";
import { Message } from "node-nats-streaming";
import { Booking } from "../../models/booking";

export class BookingCreatedListener extends Listener<BookingCreatedEvent> {
  subject: Subjects.BookingCreated = Subjects.BookingCreated;
  queueGroupName = QueueGroups.PaymentServiceQueue;
  async onMessage(data: BookingCreatedEvent["data"], msg: Message) {
    const booking = Booking.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      version: data.version,
      price: data.ride.price,
    });

    await booking.save();

    msg.ack();
  }
}
