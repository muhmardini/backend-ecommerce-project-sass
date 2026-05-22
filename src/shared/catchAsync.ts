import type { NextFunction,Response, Request, RequestHandler } from "express"

type AsyncHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void>

export function catchAsync(fn: AsyncHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
}   