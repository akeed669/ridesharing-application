import mongoose from 'mongoose';
import {app} from './app';

const start = async () => {

  // check if jwt key env variable is defined
  if(!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log('mongo connected');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000..!.')
  });

};

start();
