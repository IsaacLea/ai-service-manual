import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';


async function getUser(name: string): Promise<User | undefined> {

    // Simulate a user lookup for simplicity
    if (name.toLowerCase() === process.env.ADMIN_USERNAME?.toLowerCase()) {
        return {
            id: "1",
            name: process.env.ADMIN_USERNAME || "",
            password: process.env.ADMIN_PASSWORD || "",
        }
    } else {
        return undefined;
    }

}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {

                console.log('Authorizing user with credentials:', credentials);

                // Validate credentials using Zod
                const parsedCredentials = z
                    .object({ name: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { name, password } = parsedCredentials.data;
                    const user = await getUser(name);

                    console.log("User:", user);

                    if (!user) {
                        throw new Error('Missing User');
                    };

                    // Simulate password check (replace with actual password check)
                    const passwordsMatch = password === user.password; // For testing only, remove in production

                    console.log('Password1:', password);
                    console.log('Password2:', user.password);

                    // Return the user if the password matches
                    if (passwordsMatch) return user;

                    throw new Error("Password1: " + password + ", password2: " + user.password);
                }

                throw new Error('Missing credentials: ' + credentials + + ", Error: " + parsedCredentials.error.message);

                // console.log('Invalid credentials');
                // return null;
            },
        }),
    ],
});