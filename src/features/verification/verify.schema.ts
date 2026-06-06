import {z} from 'zod'

export const VerificationRequestSchema = z.object({
    nationalId: z.string().min(1, "National ID is required").max(100, "National ID is too long"),
    cardId: z.string().min(1, "Card ID is required").max(100, "Card ID is too long"),
    fullName: z.string().min(1, "Full name is required").max(255, "Full name is too long"),
    fatherName: z.string().min(1, "Father name is required").max(255, "Father name is too long"),
    motherName: z.string().min(1, "Mother name is required").max(255, "Mother name is too long"),
    birthdate: z.date(),
    birthCity: z.string().min(1, "Birth city is required").max(255, "Birth City is too long"),
    currentResidence: z.string().min(1, "You're current residence is required").max(255, "Current residence is too long"),
    status: z.enum(["Pending", "Approved", "Rejected"]),
})

export const GetUserRequestsSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20)
})

export type VerificationRequestInput = z.infer<typeof VerificationRequestSchema>
export type GetUserRequestsInput = z.infer<typeof GetUserRequestsSchema>