import { Publisher, BookingExpiredEvent, Subjects } from "@orgakeed/commons";

export class BookingExpiredPublisher extends Publisher<BookingExpiredEvent> {
  subject: Subjects.BookingExpired = Subjects.BookingExpired;
}
