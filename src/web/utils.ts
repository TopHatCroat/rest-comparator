import {NextFunction, Request, RequestHandler, Response} from "express-serve-static-core";

const asyncMiddleware = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch(next);
};

class UserError extends Error {
    public readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export {
    UserError,
    asyncMiddleware,
};
