import {
  Listener,
  Subjects,
  QueueGroups,
  BookingCanceledEvent,
} from "@orgakeed/commons";
import { Message } from "node-nats-streaming";
import { Ride } from "../../models/ride";
import { RideUpdatedPublisher } from "../publishers/ride-updated-publisher";

export class BookingCanceledListener extends Listener<BookingCanceledEvent> {
  subject: Subjects.BookingCanceled = Subjects.BookingCanceled;
  queueGroupName = QueueGroups.RideServiceQueue;

  async onMessage(data: BookingCanceledEvent["data"], msg: Message) {
    const ride = await Ride.findById(data.ride.id);

    if (!ride) {
      throw new Error("Ride not found");
    }

    ride.set({ bookingId: undefined });

    await ride.save();

    await new RideUpdatedPublisher(this.client).publish({
      id: ride.id,
      version: ride.version,
      destination: ride.destination,
      price: ride.price,
      userId: ride.userId,
      bookingId: ride.bookingId,
    });

    msg.ack();
  }
}
