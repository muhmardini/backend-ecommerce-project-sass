import {z} from 'zod'

export const NewBusinessSchema = z.object({
    name: z.string().min(1,"Name is required").trim(),
    description: z.string().max(255,"Description is too long").optional(),
    location: z.string().max(255, "Location is too long").trim().optional(),
    links: z.array(z.string()).optional(),
    slug: z.string().slugify().trim()
})

export const EditBusinessSchema = z.object({
    name: z.string().trim(),
    description: z.string().max(255, "Description is too long").optional(),
    location: z.string().max(255, "Location is too long").trim().optional(),
    links: z.array(z.string()).optional(),
    slug: z.string().slugify().optional()
})

export type BusinessInput = z.infer<typeof NewBusinessSchema>
export type EditBusinessInput = z.infer<typeof EditBusinessSchema>