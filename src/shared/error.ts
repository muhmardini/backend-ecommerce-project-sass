export class AppError extends Error {
    public readonly statusCode: number
    public readonly isOperational: boolean
    public readonly code?: string
    
    constructor(message: string, statusCode: number, isOperational: boolean, code:string){
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.code = code

        Object.setPrototypeOf(this, AppError.prototype);

        Error.captureStackTrace(this, this.constructor)
    }
}

export const Errors = {
    NotFound: (msg = "Resource not found") => new AppError(msg, 404,true,"NOT_FOUND"),
    Unauthorized: (msg = "Invalid credentials") => new AppError(msg, 401, true, "UNAUTHORIZED"),
    Forbidden: (msg = "Access denied") => new AppError(msg, 403, true,"FORBIDDEN"),
    Conflict: (msg = "Resource already exist") => new AppError(msg, 409, true, "CONFLICT"),
    Validation: (msg = "Validation failed") => new AppError(msg, 422, true, "VALIDATION_ERROR"),
    Internal: (msg = "Internal server error") => new AppError(msg, 500, false, "INTERNAL_ERROR"),
}