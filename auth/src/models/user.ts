import mongoose from 'mongoose';
import {PasswordManager} from '../services/password';

// this interface describes the properties required to create a new user
interface UserAttrs{
  email: string;
  password: string;
}

// this interface describes the properties that a UserModel has
interface UserModel extends mongoose.Model<UserDoc>{
  build(attrs: UserAttrs): UserDoc;
}

// this interface describes the properties that a User Document has
interface UserDoc extends mongoose.Document{
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },

  password:{
    type:String,
    required:true
  }
},

//transform the mongoose return object into a custom view
{
  toJSON:{
    transform(doc,ret){
      delete ret.password;
      delete ret.__v;
      ret.id=ret._id;
      delete ret._id
    }
  }
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});


userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc,UserModel>('User',userSchema);

export {User};
