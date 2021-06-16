import { Message } from "node-nats-streaming";
import {
  Listener,
  Subjects,
  RideUpdatedEvent,
  QueueGroups,
} from "@orgakeed/commons";

import { Ride } from "../../models/ride";

export class RideUpdatedListener extends Listener<RideUpdatedEvent> {
  subject: Subjects.RideUpdated = Subjects.RideUpdated;
  queueGroupName = QueueGroups.BookingServiceQueue;

  async onMessage(data: RideUpdatedEvent["data"], msg: Message) {
    const { id, destination, price, version } = data;

    //const ride = await Ride.findById(id);

    const ride = await Ride.findByEvent(data);

    if (!ride) {
      throw new Error(`Ride with id ${data.id} not found`);
    }

    ride.set({ destination, price });

    await ride.save();

    msg.ack();
  }
}
