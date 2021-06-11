import mongoose from "mongoose";
import { Booking, BookingStatus } from "./booking";

// this interface describes the properties required to create a new ridesharing advertisement
interface RideAttrs {
  destination: string;
  price: number;
  userId: string;
}

// this interface describes the properties that an advertisement has
interface RideModel extends mongoose.Model<RideDoc> {
  build(attrs: RideAttrs): RideDoc;
}

// this interface describes the properties that an advertisement has
export interface RideDoc extends mongoose.Document {
  destination: string;
  price: number;
  userId: string;
  // isReserved(): Promise<boolean>;
}

const rideSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    userId: {
      type: String,
      required: true,
    },
  },

  //transform the mongoose return object into a custom view
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// adding a method directly to the model

rideSchema.statics.build = (attrs: RideAttrs) => {
  return new Ride(attrs);
};

// adding a method directly to a document

// rideSchema.methods.isReserved = async function () {
// const existingBooking = await Booking.findOne({
//     ride: this,
//     status: {
//       $in: [
//         BookingStatus.Created,
//         BookingStatus.PaymentPending,
//         BookingStatus.Completed,
//       ],
//     },
//   });
//   return !!existingBooking;
// };

const Ride = mongoose.model<RideDoc, RideModel>("Ride", rideSchema);

export { Ride };
