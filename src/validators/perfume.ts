import { z } from 'zod';

export const perfumeSchema = z.object({
  perfumeName: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.coerce.number().positive('Price must be positive'),
  concentration: z.string().min(1, 'Concentration is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  ingredients: z.string().optional(),
  volume: z.coerce.number().positive('Volume must be positive'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative'),
  targetAudience: z.enum(['male', 'female', 'unisex']),
  uri: z.string().url('Image URL must be a valid URL').optional(),
});

export type PerfumeForm = z.infer<typeof perfumeSchema>;
