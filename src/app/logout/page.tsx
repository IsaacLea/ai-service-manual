'use client'

import { Suspense } from 'react';
import LogOutForm from '../components/LogOutForm';


export default function LogoutPage() {
    return (
        <div className="grid justify-items-center">
            {/* {This component is wrapped with React <Suspense> because it will access information from the incoming request (URL search params)} */}
            <Suspense>
                <LogOutForm />
            </Suspense>
        </div>
    )
}