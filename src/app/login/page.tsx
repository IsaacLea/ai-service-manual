'use client'

import { Suspense } from 'react';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
    return (
        <div className="grid justify-items-center h-full">
            {/* {This component is wrapped with React <Suspense> because it will access information from the incoming request (URL search params)} */}
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    )
}