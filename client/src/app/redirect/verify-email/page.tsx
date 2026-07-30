'use client';

import {useEffect, useState} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/axios';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState('Verifying your email...');
    const [icon, setIcon] = useState(
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
    );
    const [success, setSucces] = useState(false);
    useEffect(() => {
        const verify = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setMessage('Invalid verification link.');
                setIcon(<Image alt="Error" width={64} height={64} src="/error.svg" />);
                return;
            }

            try {
                await api.post(`/auth/verify-email?token=${token}`);

                setMessage('Email verified! Redirecting to login...');
                setIcon(<Image alt="Error" width={64} height={64} src="/success.svg" />);
                setSucces(true);
            } catch {
                setMessage('Verification failed or the link has expired.');
                setIcon(<Image alt="Error" width={64} height={64} src="/error.svg" />);
            }
        };

        verify();
    }, [searchParams, router]);

    return (
        <div className="flex flex-col justify-center items-center p-4 bg-[#f8f8ff] mt-4 rounded-xl border-2 border-gray-400 gap-4 w-md shadow-[4px_5px_3px_gray]">
            {icon}

            <h1>{message}</h1>

            {success && (
                <button className="rounded-lg border-2 border-gray-400 p-2 hover:bg-gray-200 shadow-[4px_5px_3px_gray]">
                    Go to Login
                </button>
            )}
        </div>
    );
}
