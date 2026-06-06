export interface AppResponse<T> {
    success: boolean,
    message?: string,
    data?: T
}

export interface PaginatedResponse<T> {
    success: boolean,
    message?: string,
    data: T,
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNextPage: boolean,
        hasPrevPage: boolean
    }
}

