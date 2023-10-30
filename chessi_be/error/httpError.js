class httpError extends Error {  
    constructor (httpCode, message) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
	
		this.message = message;
		this.httpCode = httpCode;
    }
  
    getHttpCode() {
        return this.httpCode;
    }
	
	getMessage() {
		return this.message;
	}
}
  
module.exports = { httpError }  
  