import mongoose from "mongoose";
import { Booking, BookingStatus } from "./booking";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// this interface describes the properties required to create a new ridesharing advertisement
interface RideAttrs {
  id: string;
  destination: string;
  price: number;
  // userId:string;
}

// this interface describes the properties that an advertisement has
interface RideModel extends mongoose.Model<RideDoc> {
  build(attrs: RideAttrs): RideDoc;
  findByEvent(event: { id: string; version: number }): Promise<RideDoc | null>;
}

// this interface describes the properties that an advertisement has
export interface RideDoc extends mongoose.Document {
  id: string;
  destination: string;
  price: number;
  version: number;
  // userId:string;
  // isReserved(): Promise<boolean>;
}

const rideSchema = new mongoose.Schema(
  {
    // id: {
    //   type: String,
    //   required: true,
    // },

    destination: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // userId: {
    //   type: String,
    //   required: true,
    // },
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

rideSchema.set("versionKey", "version");
rideSchema.plugin(updateIfCurrentPlugin);

// adding a method directly to the model

rideSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  // console.log(`this is the id ${event.id} and version ${event.version}`);
  return Ride.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

rideSchema.statics.build = (attrs: RideAttrs) => {
  return new Ride({
    _id: attrs.id,
    destination: attrs.destination,
    price: attrs.price,
  });
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
