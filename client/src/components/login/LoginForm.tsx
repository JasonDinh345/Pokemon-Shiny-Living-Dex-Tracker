'use client';
import {LabelInput} from '@/components/ui/LabelInput';
import {useAuth} from '@/context/AuthContext';
import {errorToast} from '@/util/toast';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import Image from 'next/image';
type LoginFormProps = {
    setIsRegistering: (isRegistering: boolean) => void;
};

export default function LoginForm({setIsRegistering}: LoginFormProps) {
    const router = useRouter();
    const {login} = useAuth();
    const [error, setError] = useState<string>('');
    const [form, setForm] = useState<{email: string; password: string}>({
        email: '',
        password: ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            await login(form);

            router.push('/pokedex');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data.message ?? 'Something went wrong.';
                setError(message);
                errorToast(message);
            }
        }
    };
    return (
        <div
            className={`flex flex-col justify-start items-center border-gray-700 pr-32 bg-tertiary w-2/5 h-full p-24`}
        >
            <h1 className="text-4xl text-center font-bold"> PrismaDex</h1>
            <h3 className="pt-4 text-xl text-center ">✨Welcome back!✨</h3>
            <form onSubmit={handleSubmit} className="pt-8 flex flex-col justify-center gap-4 w-1/2">
                <LabelInput
                    type={'email'}
                    onChange={handleChange}
                    value={form.email}
                    label="Email"
                />
                <LabelInput
                    type={'password'}
                    onChange={handleChange}
                    value={form.password}
                    label="Password"
                    autoComplete="current-password"
                />
                <input
                    className="bg-primary p-2 rounded-3xl border-2 hover:text-black text-secondary border-black shadow-normal transition-all duration-100 ease-in hover:bg-darkprimary hover:shadow-[2px_2px_3px_gray]"
                    type="submit"
                    value="Login"
                />
                {error && <p className="text-red-400 italic">{error}</p>}
                <p onClick={() => setIsRegistering(true)}>New User?</p>
            </form>
        </div>
    );
}
