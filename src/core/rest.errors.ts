 /**
 * Classes representing custom errors for Plugin REST functions
 * @class  RestParameterError
 * @class  RestServerError
 */  

  export class RestServerError extends Error {
    constructor(message?: string, details?: any) {
        let msg = message;
        if (details) {
            msg = `${message}\n${JSON.stringify(details, null, 2)}`;
        }
        super(msg);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = RestServerError.name; // stack traces display correctly now 
    }
  }