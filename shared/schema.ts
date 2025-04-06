import { z } from 'zod'

export const SouvenirSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  location: z.string().min(1),
  description: z.string().optional(),
})

export type Souvenir = z.infer<typeof SouvenirSchema>