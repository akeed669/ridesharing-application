import { Publisher, Subjects, BookingCreatedEvent } from "@orgakeed/commons";

export class BookingCreatedPublisher extends Publisher<BookingCreatedEvent> {
  subject: Subjects.BookingCreated = Subjects.BookingCreated;
}
