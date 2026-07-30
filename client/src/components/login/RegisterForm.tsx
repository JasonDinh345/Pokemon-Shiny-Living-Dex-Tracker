'use client';

import {useState} from 'react';
import {LabelInput} from '../LabelInput';
import {useAuth} from '@/context/AuthContext';

type RegisterFormProps = {
    setIsRegistering: (isRegistering: boolean) => void;
};
export default function RegisterForm({setIsRegistering}: RegisterFormProps) {
    const {error, register} = useAuth();
    const [form, setForm] = useState<{email: string; password: string; username: string}>({
        email: '',
        password: '',
        username: ''
    });
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [isValid, setIsValid] = useState<boolean>(true);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form.password != confirmPass) {
            setIsValid(false);
            return;
        }
        await register(form);
    };
    //SETUP REDIRECT AFTER SUCCESSFUL REGISTER
    return (
        <div className="flex flex-col justify-start items-center border-gray-700 pr-32 bg-tertiary w-2/5 h-full p-24">
            <h1 className="text-4xl text-center font-bold">Welcome to PrismaDex!</h1>
            <h3 className="pt-4 text-xl text-center ">✨Start your Dex today!✨</h3>
            <form onSubmit={handleSubmit} className="pt-8 flex flex-col justify-center gap-4 w-1/2">
                <LabelInput
                    type={'email'}
                    onChange={handleChange}
                    value={form.email}
                    label="Email"
                />
                <LabelInput
                    type={'text'}
                    onChange={handleChange}
                    value={form.username}
                    label="Username"
                />
                <LabelInput
                    type={'password'}
                    onChange={handleChange}
                    value={form.password}
                    label="Password"
                />
                <LabelInput
                    type={'password'}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    value={confirmPass}
                    label="Confirm  Password"
                />
                <input type="submit" value="Register Now" />
                {error ? <p>{error}</p> : !isValid ? <p>{error}</p> : <></>}
                <p onClick={() => setIsRegistering(false)}>Existing User?</p>
            </form>
        </div>
    );
}
