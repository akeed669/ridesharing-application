import {
  Listener,
  Subjects,
  RidePostedEvent,
  QueueGroups,
} from "@orgakeed/commons";
import { Message } from "node-nats-streaming";
import { Ride } from "../../models/ride";

export class RidePostedListener extends Listener<RidePostedEvent> {
  subject: Subjects.RidePosted = Subjects.RidePosted;
  queueGroupName = QueueGroups.BookingServiceQueue;
  async onMessage(data: RidePostedEvent["data"], msg: Message) {
    const { id, destination, price } = data;

    const ride = Ride.build({
      id,
      destination,
      price,
    });

    await ride.save();

    msg.ack();
  }
}
