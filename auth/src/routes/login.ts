import express from 'express';

const router = express.Router();

router.post('/api/users/login',(req,res)=>{

  res.send('Du, was geht?');

});

export {router as loginRouter};
