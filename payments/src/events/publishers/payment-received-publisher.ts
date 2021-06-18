import { Publisher, Subjects, PaymentGeneratedEvent } from "@orgakeed/commons";

export class PaymentReceivedPublisher extends Publisher<PaymentGeneratedEvent> {
  subject: Subjects.PaymentGenerated = Subjects.PaymentGenerated;
}
