import mongoose from 'mongoose';
import {BookingStatus} from '@orgakeed/commons';
import {RideDoc} from './ride';

// this interface describes the properties required to create a new ridesharing advertisement
interface BookingAttrs{
  userId:string;
  status: BookingStatus;
  expiresAt:Date;
  ride: RideDoc;
}

// this interface describes the properties that an advertisement has
interface BookingModel extends mongoose.Model<BookingDoc>{
  build(attrs: BookingAttrs): BookingDoc;
}

// this interface describes the properties that an advertisement has
interface BookingDoc extends mongoose.Document{
  userId:string;
  status: BookingStatus;
  expiresAt:Date;
  ride: RideDoc;
}

const bookingSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },

  status:{
    type:String,
    required:true,
    enum: Object.values(BookingStatus),
    default: BookingStatus.Created
  },

  expiresAt:{
    type:mongoose.Schema.Types.Date
  },

  ride:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Ride'
  },
},

//transform the mongoose return object into a custom view
{
  toJSON:{
    transform(doc,ret){
      ret.id=ret._id;
      delete ret._id
    }
  }
});

bookingSchema.statics.build = (attrs: BookingAttrs) => {
  return new Booking(attrs);
};

const Booking = mongoose.model<BookingDoc,BookingModel>('Booking',bookingSchema);

export {Booking,BookingStatus};
