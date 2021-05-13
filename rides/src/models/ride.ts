import mongoose from 'mongoose';

// this interface describes the properties required to create a new ridesharing advertisement
interface RideAttrs{
  destination: string;
  price: number;
  userId:string;
}

// this interface describes the properties that an advertisement has
interface RideModel extends mongoose.Model<RideDoc>{
  build(attrs: RideAttrs): RideDoc;
}

// this interface describes the properties that an advertisement has
interface RideDoc extends mongoose.Document{
  destination: string;
  price: string;
  userId:string;
}

const rideSchema = new mongoose.Schema({
  destination:{
    type:String,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  userId:{
    type:String,
    required:true
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

rideSchema.statics.build = (attrs: RideAttrs) => {
  return new Ride(attrs);
};

const Ride = mongoose.model<RideDoc,RideModel>('Ride',rideSchema);

export {Ride};
