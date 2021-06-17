import Queue from "bull";
import { BookingExpiredPublisher } from "../events/publishers/booking-expired-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  bookingId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new BookingExpiredPublisher(natsWrapper.client).publish({
    bookingId: job.data.bookingId,
  });
});

export { expirationQueue };
