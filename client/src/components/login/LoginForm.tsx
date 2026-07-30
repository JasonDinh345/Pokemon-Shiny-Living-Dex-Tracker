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
        <div
            className={`flex flex-col justify-start items-center border-gray-700 pr-32 bg-tertiary w-2/5 h-full p-24`}
        >
            <h1 className="text-4xl text-center font-bold">PrismaDex</h1>
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
                    autocomplete="current-password"
                />
                <input
                    className="border-2 border-black rounded-lg bg-secondary"
                    type="submit"
                    value="Login"
                />
                {error || <p>{error}</p>}
                <p onClick={() => setIsRegistering(true)}>New User?</p>
            </form>
        </div>
    );
}
