import { z } from 'zod';

export const registrationSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be between 2 and 50 characters')
    .max(50, 'Name must be between 2 and 50 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  phoneNumber: z
    .string({ required_error: 'Phone number is Required' })
    .min(10, 'Phone number must be at least 10 characters'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 8 characters'),
  passwordConfirm: z
    .string({ required_error: 'Password Confirmation is required' })
    .min(1),
});
