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
    return (
        <div className="flex-col justify-center border-2 border-gray-700 rounded-lg p-2 mt-8 justify-self-start">
            <form onSubmit={handleSubmit} className=" flex flex-col justify-center">
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
