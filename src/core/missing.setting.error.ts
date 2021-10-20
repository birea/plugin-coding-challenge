 /**
 * A class representing a custom error when a seeting is missing in a plugin
 * @class  MissingSettingError
 */  
  export class MissingSettingError extends Error {
    constructor(message?: string, details?: any) {
        let msg = message;
        if (details) {
            msg = `${message}\n${JSON.stringify(details, null, 2)}`;
        }
        super(msg);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = MissingSettingError.name; // stack traces display correctly now 
    }
}