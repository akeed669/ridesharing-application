import { BookingStatus } from "@orgakeed/commons";
import mongoose, { Mongoose } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface BookingAttrs {
  id: string;
  userId: string;
  status: BookingStatus;
  version: number;
  price: number;
}

interface BookingDoc extends mongoose.Document {
  userId: string;
  status: BookingStatus;
  version: number;
  price: number;
}

interface BookingModel extends mongoose.Model<BookingDoc> {
  build(attrs: BookingAttrs): BookingDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<BookingDoc | null>;
}

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(BookingStatus),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// override the default property name for the versionKey on mongoose
// the default is '__v' and here it is set to 'version'
bookingSchema.set("versionKey", "version");
bookingSchema.plugin(updateIfCurrentPlugin);

bookingSchema.statics.build = (attrs: BookingAttrs) => {
  return new Booking({
    _id: attrs.id,
    userId: attrs.userId,
    status: attrs.status,
    version: attrs.version,
    price: attrs.price,
  });
};

bookingSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Booking.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Booking = mongoose.model<BookingDoc, BookingModel>(
  "Booking",
  bookingSchema
);

export { Booking };
