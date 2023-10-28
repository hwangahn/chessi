const { httpError } = require('../error/httpError');

let checkHttpError = (err) => {
    return err instanceof httpError;
}

module.exports = { checkHttpError }