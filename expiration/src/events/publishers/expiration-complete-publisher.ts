import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@gmmtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
