import {
  Listener,
  QueueGroups,
  Subjects,
  BookingCreatedEvent,
} from "@orgakeed/commons";

import { Message } from "node-nats-streaming";
import { expiryQueue } from "../../queues/expiry-queue";

export class BookingCreatedListener extends Listener<BookingCreatedEvent> {
  subject: Subjects.BookingCreated = Subjects.BookingCreated;
  queueGroupName = QueueGroups.ExpiryServiceQueue;

  async onMessage(data: BookingCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`waiting for ${delay} ms for processing`);

    await expiryQueue.add(
      {
        bookingId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
