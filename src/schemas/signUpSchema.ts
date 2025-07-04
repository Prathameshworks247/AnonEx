import {z} from 'zod';

export const usernameValidation = z
    .string()
    .min(3, {message: 'Username must be at least 3 characters long'})
    .max(20, {message: 'Username must be at most 20 characters long'})
    .regex(/^[a-zA-Z0-9_]+$/, {message: 'Username can only contain letters, numbers, and underscores'});
//username already taken
// username must be unique in the database (this will be handled in the backend logic, not in the schema)
export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string()
        .min(8, {message: 'Password must be at least 8 characters long'})
        .max(50, {message: 'Password must be at most 50 characters long'})
        .regex(/[A-Z]/, {message: 'Password must contain at least one uppercase letter'})
        .regex(/[a-z]/, {message: 'Password must contain at least one lowercase letter'})
        .regex(/[0-9]/, {message: 'Password must contain at least one number'})
        .regex(/[\W_]/, {message: 'Password must contain at least one special character'}),
})