import type { Request, Response, NextFunction } from "express";
import { AppError } from "#shared/error";
import { ZodError } from "zod";

export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof AppError){
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
        })
    }

    if(err instanceof ZodError){
        res.status(422).json({
            success: false,
            error: "Validation failed",
        })
    }

    console.error('Unhandled error: ', err)
    res.status(500).json({
        success: false,
        error: 'Internal Server error'
    })
}
