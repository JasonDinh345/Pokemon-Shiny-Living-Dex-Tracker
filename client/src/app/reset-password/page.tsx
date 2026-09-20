'use client';
import {LabelInput} from '@/components/ui/LabelInput';
import api from '@/lib/axios';
import {errorToast} from '@/util/toast';
import axios from 'axios';
import {useState} from 'react';

export default function ResetPasswordPage() {
    const [sentEmail, setSentEmail] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await api.post('/auth/forgot-password', {email});
            setSentEmail(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data.message ?? 'Something went wrong.';

                errorToast(message);
            }
        }
    };

    return (
        <div className="size-full flex justify-center">
            <div className="flex flex-col h-1/3 justify-center items-center p-4 bg-[#f8f8ff] mt-4 rounded-xl border-2 border-gray-400 gap-4 w-md shadow-[4px_5px_3px_gray]">
                {sentEmail ? (
                    <>
                        <h1 className="font-bold text-2xl text-center">Successfully Sent Email</h1>
                        <p>Check your email to reset your password!</p>
                    </>
                ) : (
                    <>
                        <h1 className="font-bold text-2xl text-center">Reset your password</h1>
                        <p className="text-center">
                            Enter your user account's verified email address and we will send you a
                            password reset link.
                        </p>
                        <form className="w-4/5 flex flex-col gap-2" onSubmit={handleSubmit}>
                            <LabelInput
                                label={'Email'}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                value={email}
                                type="email"
                            />
                            <input
                                className="bg-primary p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal transition-all duration-100 ease-in hover:bg-darkprimary hover:shadow-[2px_2px_3px_gray]"
                                type="submit"
                                value="Send Email"
                            />
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
