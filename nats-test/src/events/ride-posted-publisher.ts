import {Publisher} from './base-publisher';
import {RidePostedEvent} from './ride-posted-event';
import {Subjects} from './subjects';

export class RidePostedPublisher extends Publisher<RidePostedEvent>{

  subject : Subjects.RidePosted = Subjects.RidePosted;

}
