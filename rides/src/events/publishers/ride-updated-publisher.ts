import { Publisher, Subjects, RideUpdatedEvent } from '@orgakeed/commons';

export class RideUpdatedPublisher extends Publisher<RideUpdatedEvent>{

  subject:Subjects.RideUpdated = Subjects.RideUpdated;


}
