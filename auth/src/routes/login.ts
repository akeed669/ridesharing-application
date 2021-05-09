import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {validateRequest} from '../middlewares/validate-request';
import jwt from 'jsonwebtoken';
import {User} from '../models/user';
import {PasswordManager} from '../services/password';
import {BadRequestError} from '../errors/bad-request-error';

const router = express.Router();

router.post('/api/users/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Please enter a password!')

  ],

  validateRequest,

  async (req: Request, res: Response) => {
    const {email,password} = req.body;
    const existingUser = await User.findOne({email});

    if(!existingUser){
      throw new BadRequestError('Invalid login credentials');
    }

    const passwordMatch = await PasswordManager.compare(existingUser.password,password);

    if(!passwordMatch){
      throw new BadRequestError('Invalid login credentials');
    }

    // generate a JWT
    const userToken = jwt.sign({
      id:existingUser.id,
      email:existingUser.email
    },process.env.JWT_KEY!);

    // store JWT on the session object
    req.session={
      jwt:userToken
    }

    res.status(200).send(existingUser);
  }

);

export { router as loginRouter };
