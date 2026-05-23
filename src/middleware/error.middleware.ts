import type { Request, Response, NextFunction } from "express";
import { AppError } from "#shared/error";

export const errorMiddleware = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof AppError){
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    }
    console.error('Unhandled error: ', err)
    res.status(500).json({
        success: false,
        message: 'Internal Server error'
    })
}
