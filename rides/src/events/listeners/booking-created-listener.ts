import {
  Listener,
  BookingCreatedEvent,
  Subjects,
  QueueGroups,
} from "@orgakeed/commons";
import { Message } from "node-nats-streaming";
import { Ride } from "../../models/ride";
import { RideUpdatedPublisher } from "../publishers/ride-updated-publisher";

export class BookingCreatedListener extends Listener<BookingCreatedEvent> {
  subject: Subjects.BookingCreated = Subjects.BookingCreated;
  queueGroupName = QueueGroups.RideServiceQueue;

  async onMessage(data: BookingCreatedEvent["data"], msg: Message) {
    //find the ride associated with the booking
    const ride = await Ride.findById(data.ride.id);

    if (!ride) {
      throw new Error("Ride not found");
    }

    //reserve the ride by appending the orderId to it
    ride.set({
      bookingId: data.id,
    });

    //save the ride to the DB
    await ride.save();
    //await is used so that if anything fails when publishing
    //the event below, it will not be acked
    await new RideUpdatedPublisher(this.client).publish({
      id: ride.id,
      version: ride.version,
      destination: ride.destination,
      price: ride.price,
      bookingId: ride.bookingId,
      userId: ride.userId,
    });

    //acknowledge the event as processed
    msg.ack();
  }
}
