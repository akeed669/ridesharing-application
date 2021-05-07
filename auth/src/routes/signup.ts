import express, {Request,Response} from 'express';
import {body,validationResult} from 'express-validator';
import {RequestValidationError} from '../errors/request-validation-error';
import {DatabaseConnectionError} from '../errors/database-conn-error';

const router = express.Router();

router.post('/api/users/signup',[
  body('email')
  .isEmail()
  .withMessage('Email needs to be a valid one'),
  body('password')
  .trim()
  .isLength({min:3,max:20})
  .withMessage('Password needs to be between 3 and 20 characters')

],(req: Request, res: Response)=>{

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    throw new RequestValidationError(errors.array());
  }

  console.log('creating a user...');
  throw new DatabaseConnectionError();
  //const {email, password} = req.body;

  //res.send({});

});

export {router as signupRouter};
