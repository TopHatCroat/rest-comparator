const asyncMiddleware = fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
};

class UserError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export {
    UserError,
    asyncMiddleware
};