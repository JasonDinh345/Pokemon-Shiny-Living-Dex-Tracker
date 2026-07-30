import {LabelInput} from '@/components/LabelInput';
import {useAuth} from '@/context/AuthContext';
import {useState} from 'react';

type LoginFormProps = {
    setIsRegistering: (isRegistering: boolean) => void;
};

export default function LoginForm({setIsRegistering}: LoginFormProps) {
    const {login, error} = useAuth();
    const [form, setForm] = useState<{email: string; password: string}>({
        email: '',
        password: ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(form);
        if (!error) {
            console.log('done');
        }
    };
    return (
        <div className="flex-col justify-center border-2 border-gray-700 rounded-lg p-2 mt-8 bg-[#f8f8ff] w-xl">
            <form onSubmit={handleSubmit} className=" flex flex-col justify-center gap-4">
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
                />
                <input className="border-2 border-black rounded-lg" type="submit" value="Login" />
                {error || <p>{error}</p>}
                <p onClick={() => setIsRegistering(true)}>New User?</p>
            </form>
        </div>
    );
}
