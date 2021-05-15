import nats from 'node-nats-streaming';
import {RidePostedPublisher} from './events/ride-posted-publisher';

console.clear();

const stan = nats.connect('carpooling','abc',{
  url:'http://localhost:4222',
});

stan.on('connect',async()=>{
  console.log('Publisher connected to NATS SS');

  const publisher = new RidePostedPublisher(stan);

  try{
    await publisher.publish({
      id:'111',
      destination:'Bombay',
      price:9000
    });
  } catch(err){
    console.error(err);
  }


  // const data = JSON.stringify({
  //   id:2234,
  //   destination:'Negombo',
  //   price:4578
  // });

  // stan.publish('ride:created',data,()=>{
  //   console.log('Event published');
  // });


});
