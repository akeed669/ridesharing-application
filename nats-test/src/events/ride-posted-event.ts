  import {Subjects} from './subjects';

export interface RidePostedEvent{
  subject: Subjects.RidePosted;
  data:{
    id:string;
    destination:string;
    price:number;
  };
}
