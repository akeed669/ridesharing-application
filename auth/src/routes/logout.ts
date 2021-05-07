import express from 'express';

const router = express.Router();

router.post('/api/users/logout',(req,res)=>{

  res.send('Du, was geht?');

});

export {router as logoutRouter};
