import {
  Listener,
  QueueGroups,
  Subjects,
  BookingCreatedEvent,
} from "@orgakeed/commons";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class BookingCreatedListener extends Listener<BookingCreatedEvent> {
  subject: Subjects.BookingCreated = Subjects.BookingCreated;
  queueGroupName = "changeThisNameASAP";
  async onMessage(data: BookingCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(`waiting ${delay} ms bruh`);

    await expirationQueue.add(
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
