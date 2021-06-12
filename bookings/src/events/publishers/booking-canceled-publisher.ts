import { Publisher, Subjects, BookingCanceledEvent } from "@orgakeed/commons";

export class BookingCanceledPublisher extends Publisher<BookingCanceledEvent> {
  subject: Subjects.BookingCanceled = Subjects.BookingCanceled;
}
