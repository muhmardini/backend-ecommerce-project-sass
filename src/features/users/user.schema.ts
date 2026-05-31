import {z} from 'zod'

export const EditProfileSchema = z.object({
    name: z.string().max(100,"Name too long").trim().optional(),
    email: z.email("Invalid email format").toLowerCase().trim().optional(),
    avatar: z.string().max(255).trim().optional(),
    job: z.string().max(100, "Job title is too long").optional(),
    location: z.string().max(100, "Location is too long").trim().optional(),
    birthDay: z.date().optional(),
    gender: z.enum(["Male", "Female"]).optional(),
    preferredLanguage: z.enum(["en", "ar", "fr", "ru", "ge", "tu"]).optional()
}).refine(
    (data) => Object.values(data).some((value) => value !== undefined)
)


export type EditProfileInput = z.infer<typeof EditProfileSchema>