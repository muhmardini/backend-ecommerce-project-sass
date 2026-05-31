
export {}
export interface AuthUser{
    id: string,
    role: "Admin" | "User"
}

declare global {
    namespace Express{
        interface Request{
            user?: AuthUser
        }
    }
}