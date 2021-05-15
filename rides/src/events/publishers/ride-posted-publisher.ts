import { Publisher, Subjects, RidePostedEvent } from '@orgakeed/commons';

export class RidePostedPublisher extends Publisher<RidePostedEvent>{

  subject:Subjects.RidePosted = Subjects.RidePosted;
  

}
