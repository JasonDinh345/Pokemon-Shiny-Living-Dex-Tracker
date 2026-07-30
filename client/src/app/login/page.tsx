'use client';
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';
import {motion} from 'motion/react';
import {useState} from 'react';

export default function Login() {
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    return (
        <div
            className={`relative flex flex-1 flex-row items-center justify-between w-screen bg-tertiary overflow-hidden rounded-l-md`}
        >
            <motion.div
                className="absolute top-0 left-0 w-3/5 h-full bg-primary"
                initial={{
                    borderTopRightRadius: '2rem',
                    borderBottomRightRadius: '2rem'
                }}
                animate={{
                    x: isRegistering ? '66.66%' : '0%',
                    borderTopLeftRadius: isRegistering ? '2rem' : '0rem',
                    borderBottomLeftRadius: isRegistering ? '2rem' : '0rem',
                    borderTopRightRadius: isRegistering ? '0rem' : '2rem',
                    borderBottomRightRadius: isRegistering ? '0rem' : '2rem'
                }}
                transition={{
                    duration: 1,
                    ease: 'easeInOut'
                }}
            />

            <RegisterForm setIsRegistering={setIsRegistering} />

            <LoginForm setIsRegistering={setIsRegistering} />
        </div>
    );
}
