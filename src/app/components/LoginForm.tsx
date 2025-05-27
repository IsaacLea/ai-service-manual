'use client'

import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

export default function LoginForm() {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (

        <form action={formAction} className="flex-1 h-full w-full max-w-xl bg-white rounded-xl shadow-lg p-8 items-center flex flex-col space-y-4 text-black">
            <h1>Login</h1>

            <div className="w-full">
                <div>
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="userName"
                    >
                        User name
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="userName"
                            type="userName"
                            name="userName"
                            placeholder="Enter your user name"
                            required
                        />

                    </div>
                </div>
                <div className="mt-4">
                    <label
                        className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            required
                            minLength={6}
                        />

                    </div>
                </div>
            </div>

            <input type="hidden" name="redirectTo" value={callbackUrl} />
            <div className="my-4" />
            <button
                type="submit"
                className="px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600"
                aria-disabled={isPending}>
                Log in
            </button>

            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <>
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>
        </form>


    )
}