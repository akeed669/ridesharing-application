import Queue from "bull";

interface Payload {
  bookingId: string;
}

const expiryQueue = new Queue<Payload>("order:expiry", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expiryQueue.process(async (job) => {
  console.log("come back and fix ", job.data.bookingId);
});

export { expiryQueue };
