import {CustomError} from './custom-error';

export class InvalidRouteError extends CustomError{
  statusCode=404;
  constructor(){
    super('Invalid route URL');

    Object.setPrototypeOf(this, InvalidRouteError.prototype);
  }

  serializeErrors(){

      return [{ message: "Invalid route biatch" }]

  }
}
