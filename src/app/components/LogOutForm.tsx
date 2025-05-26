'use client'

import { logOut } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function LoginForm() {

    const [errorMessage, formAction] = useActionState(
        logOut,
        undefined,
    );

    return (

        <form action={formAction} className="">
            <button
                type="submit"
                className="text-blue-600 hover:underline font-medium cursor-pointer"
            >
                Logout
            </button>
            {errorMessage && typeof errorMessage === 'string' && (
                <p className="mt-2 text-red-500 text-sm">{errorMessage}</p>
            )}
            {errorMessage && typeof errorMessage === 'object' && 'message' in errorMessage && (
                <p className="mt-2 text-red-500 text-sm">{errorMessage.message}</p>
            )}
        </form>


    )
}