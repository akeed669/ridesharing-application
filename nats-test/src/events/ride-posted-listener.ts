
import {Listener} from './base-listener';
import {Message} from 'node-nats-streaming';
import {RidePostedEvent} from './ride-posted-event';
import {Subjects} from './subjects';

export class RidePostedListener extends Listener <RidePostedEvent> {

  subject:Subjects.RidePosted = Subjects.RidePosted;
  queueGroupName = 'payments-service';
  onMessage(data:RidePostedEvent['data'], msg:Message){
    console.log('Event data, ', data);

    console.log(data.destination);

    msg.ack();
  }

}
