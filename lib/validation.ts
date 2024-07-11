import { z } from "zod";
export const UserFormValidation = z.object({
    name: z.string().min(2, {message: 'User must have 2 or more characters'}),
    email: z.string().email('Invalid Email'),
    phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number")
  })