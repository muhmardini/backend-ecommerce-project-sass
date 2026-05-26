import {z} from 'zod'

export const BusinessSchema = z.object({
    name: z.string().min(1,"Name is required").trim(),
    description: z.string().max(255,"Description is too long").trim().optional(),
    location: z.string().max(255, "Location is too long").trim().optional(),
    links: z.array(z.string()).optional(),
    slug: z.string().trim()
})

export type BusinessInput = z.infer<typeof BusinessSchema>