export interface IUser {
  userId: string;
  name: string;
  email: string;
  isActive?: boolean;
  role: 'customer' | 'meal_provider';
  dietaryPreferences?: string[];
  cuisineSpecialties?: string[];
  iat?: number;
  exp?: number;
}
