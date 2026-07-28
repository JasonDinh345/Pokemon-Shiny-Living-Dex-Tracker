'use client';
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import {useState} from 'react';

export default function Login() {
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    return (
        <div>
            {isRegistering ? (
                <RegisterForm setIsRegistering={setIsRegistering} />
            ) : (
                <LoginForm setIsRegistering={setIsRegistering} />
            )}
        </div>
    );
}
