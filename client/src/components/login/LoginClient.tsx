'use client';
import LoginForm from '@/components/login/LoginForm';
import RegisterForm from '@/components/login/RegisterForm';

import {motion} from 'motion/react';
import {useState} from 'react';
import Image from 'next/image';
export function LoginClient() {
    const [isRegistering, setIsRegistering] = useState<boolean>(false);

    return (
        <div
            className={`relative flex flex-1 flex-row items-center justify-between w-screen bg-tertiary overflow-hidden rounded-l-md`}
        >
            <motion.div
                className="absolute top-0 left-0 w-3/5 h-full bg-primary flex flex-col items-center justify-evenly gap-2"
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
                    duration: 0.75,
                    ease: 'easeInOut'
                }}
            >
                <div className="w-1/2 flex flex-col items-center gap-2">
                    <motion.h1
                        className="font-bold text-4xl text-secondary shadow-norm"
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{
                            duration: 0.3,
                            ease: 'easeOut'
                        }}
                    >
                        {isRegistering ? 'Start on your Journey!' : 'Resume your Shiny Living Dex!'}
                    </motion.h1>
                    <div className="relative h-10 w-full overflow-hidden rounded-3xl border-2 border-darkprimary bg-secondary shadow-normal">
                        <motion.p
                            className="absolute inset-0 z-10 flex items-center justify-center"
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{
                                duration: 0.3,
                                ease: 'easeOut'
                            }}
                        >
                            {isRegistering ? '0/1025' : '???/1025'}
                        </motion.p>
                        <motion.div
                            className="h-full bg-darkprimary"
                            initial={{width: 0}}
                            animate={{
                                width: isRegistering ? '0%' : `${Math.random() * 100}%`
                            }}
                            transition={{
                                duration: 0.5,
                                ease: 'easeInOut'
                            }}
                        />
                    </div>
                </div>
                <motion.div
                    className="bg-secondary size-96  rounded-full flex justify-center items-center shadow-normal"
                    initial={{scaleX: -1}}
                    animate={{
                        scaleX: isRegistering ? 1 : -1
                    }}
                    exit={{opacity: 0}}
                    transition={{
                        scaleX: {
                            duration: 0.5,
                            ease: 'easeInOut'
                        }
                    }}
                >
                    <Image
                        src={'/zygarde.svg'}
                        alt={'zygarde'}
                        width={200}
                        height={200}
                        loading="eager"
                    />
                </motion.div>
                <motion.p
                    className="font-bold text-2xl text-secondary shadow-norm"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{
                        duration: 0.3,
                        ease: 'easeOut'
                    }}
                >
                    {isRegistering
                        ? 'PrismaDex allows you to track your shinies to help you complete your Shiny Living Dex!'
                        : 'Continue to record and track your progress with PrismaDex!'}
                </motion.p>
            </motion.div>

            <RegisterForm setIsRegistering={setIsRegistering} />

            <LoginForm setIsRegistering={setIsRegistering} />
        </div>
    );
}
