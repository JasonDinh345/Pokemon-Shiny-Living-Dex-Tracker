'use client';
import api from '@/lib/axios';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import Image from 'next/image';
import {LabelInput} from '@/components/ui/LabelInput';
import axios from 'axios';
import {errorToast} from '@/util/toast';
export default function ResetPasswordRedirect() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState('Verifying your request...');
    const [icon, setIcon] = useState(
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
    );
    const [passwords, setPasswords] = useState<{password: string; confirmPass: string}>({
        password: '',
        confirmPass: ''
    });
    const [verified, setVerified] = useState<boolean>(false);
    const [success, setSucces] = useState(false);
    const token = searchParams.get('token');
    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setError('Invalid reset password link.');
                setIcon(<Image alt="Error" width={64} height={64} src="/error.svg" />);
                return;
            }

            try {
                await api.get(`/auth/reset-password?token=${token}`);

                setVerified(true);
            } catch {
                setError('Request failed or the link has expired.');
                setIcon(<Image alt="Error" width={64} height={64} src="/error.svg" />);
            }
        };

        verify();
    }, [searchParams, router]);
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passwords.password !== passwords.confirmPass) {
            setError('Passwords do not match!');
            return;
        }
        try {
            await api.patch('/auth/reset-password', {password: passwords.password, token});
            setSucces(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data.message ?? 'Something went wrong.';

                errorToast(message);
            }
        }
    };

    return (
        <div className="size-full flex justify-center">
            <div className="flex flex-col h-fit justify-center items-center p-4 bg-[#f8f8ff] mt-4 rounded-xl border-2 border-gray-400 gap-4 w-md shadow-[4px_5px_3px_gray]">
                {verified ? (
                    <>
                        {success ? (
                            <>
                                <h1 className="font-bold text-2xl text-center">
                                    Successfully Reset Password
                                </h1>
                                <p>
                                    You have changed your password! You may now log back in and
                                    continue your Living Shiny Dex!
                                </p>
                                <button className="rounded-lg border-2 border-gray-400 p-2 hover:bg-gray-200 shadow-[4px_5px_3px_gray]">
                                    Go to Login
                                </button>
                            </>
                        ) : (
                            <>
                                <h1 className="font-bold text-2xl text-center">
                                    Reset your password
                                </h1>

                                <form className="w-4/5 flex flex-col gap-2" onSubmit={handleSubmit}>
                                    <LabelInput
                                        label={'New Password'}
                                        onChange={(e) => {
                                            setPasswords({...passwords, password: e.target.value});
                                        }}
                                        value={passwords.password}
                                        type="password"
                                    />
                                    <LabelInput
                                        label={'Confirm New Password'}
                                        onChange={(e) => {
                                            setPasswords({
                                                ...passwords,
                                                confirmPass: e.target.value
                                            });
                                        }}
                                        value={passwords.confirmPass}
                                        type="password"
                                    />
                                    <input
                                        className="bg-primary p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal transition-all duration-100 ease-in hover:bg-darkprimary hover:shadow-[2px_2px_3px_gray]"
                                        type="submit"
                                        value="Reset Password"
                                    />
                                </form>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {icon}

                        <h1>{error}</h1>
                    </>
                )}
            </div>
        </div>
    );
}
