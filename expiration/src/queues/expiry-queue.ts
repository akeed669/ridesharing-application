import Queue from "bull";
import { BookingExpiredPublisher } from "../events/publishers/booking-expired-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  bookingId: string;
}

const expiryQueue = new Queue<Payload>("order:expiry", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expiryQueue.process(async (job) => {
  // console.log("come back and fix ", job.data.bookingId);
  new BookingExpiredPublisher(natsWrapper.client).publish({
    bookingId: job.data.bookingId,
  });
});

export { expiryQueue };
