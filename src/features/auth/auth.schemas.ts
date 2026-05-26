import {z} from 'zod'

export const RegisterSchema = z.object({
    email: z.email("Invalid email format").toLowerCase().trim(),
    password: z.string().min(8, "Password must at least contain 8 characters").max(128, "Password too long"),
    name: z.string().min(1, "Name is Required").max(100, "Name is too long").trim(),
});

export const LoginSchema = z.object({
    email: z.email().toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
})

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;